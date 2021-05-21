<?php

namespace App\Http\Controllers;

use App\Models\PersonHourlyEvents;
use App\Models\User;
use App\Modules\ElasticSearch\ElasticSearchQuery;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SearchController extends Controller {

    public function search(Request $request) {

        $query = new ElasticSearchQuery();

        $limit = $request->limit ? $request->limit : 6;
        $offset = $request->offset ? $request->offset : 0;

        if($queryString = $request->query_string){
            $query->shouldMultimatch($queryString, ElasticSearchQuery::SEARCHABLE_FIELDS, ElasticSearchQuery::TYPE_CROSS_FIELDS);
        }
        if($countries = $request->country) {
            $query->setRelationFilter('person.country', 'name', $countries);
        }
        if($offers = $request->offers) {
            $query->setRelationFilter('person.offers', 'name', $offers);
        }
        if($skills = $request->skills) {
            $query->setRelationFilter('person.skills', 'name', $skills);
        }
        if($industries = $request->industries) {
            $query->setRelationFilter('person.industries', 'name', $industries);
        }
        if($min_rates = $request->min_rates) {
            $query->setRelationRange('person.rate', 'cost', $min_rates, ElasticSearchQuery::RANGE_GTE);
        }
        if($max_rates = $request->max_rates) {
            $query->setRelationRange('person.rate', 'cost', $max_rates, ElasticSearchQuery::RANGE_LTE);
        }

        $start_date = $request->start_date;
        $end_date = $request->end_date;
        if( $start_date || $end_date ) {
            $query->setRelationFilter('person.hourly_events', 'status', PersonHourlyEvents::STATUS_AVAILABLE);
            $startD = isset($start_date) ? Carbon::createFromFormat('Y-m-d', $start_date)->startOfDay()->toDateTimeString() : null;
            $endD = isset($end_date) ? Carbon::createFromFormat('Y-m-d', $end_date)->endOfDay()->toDateTimeString() : null;
            $query->setDateRange('person.hourly_events', 'start_time', $startD, $endD);
        }
        $start_time = $request->start_time;
        $end_time = $request->end_time;
        if($start_time || $end_time) {
            $query->setRelationFilter('person.hourly_events', 'status', PersonHourlyEvents::STATUS_AVAILABLE);
            $abstractDay = Carbon::createFromFormat('H:i:s', $start_time)->startOfDay();
            $startMinutesFromDayStart = Carbon::createFromFormat('H:i:s', $start_time, $request->user()->tz)->setTimezone('UTC')->diffInMinutes($abstractDay);
            $startMinOfDay = $start_time ? $startMinutesFromDayStart % 1440 : null;
            $endMinutesFromDayStart = Carbon::createFromFormat('H:i:s', $end_time, $request->user()->tz)->setTimezone('UTC')->diffInMinutes($abstractDay);
            $endMinOfDay = $end_time ? $endMinutesFromDayStart % 1440 : null;

            /**
             * $startMinOfDay should be integer. It's number of minute from start of Day. Range 0 - 1440;
             *
             */

            $query->setTimeRange('person.hourly_events', 'start_minute', $startMinOfDay, $endMinOfDay);
        }




        $result = User::searchByQuery($query->getQuery(), null, null, $limit, $offset);
        return $result;
    }

}
