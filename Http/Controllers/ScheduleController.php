<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\Models\PersonHourlyEvents;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;


class ScheduleController extends Controller
{
    protected $person;

    protected $weekdays;

    protected $periods;

    protected $interval;

    protected $repeat;

    /**
     * @var Carbon $start_day
     */
    protected $start_day = null;

    /**
     * @var Carbon $end_day
     */
    protected $end_day = null;

    /**
     * @param Request $request
     * @param $id
     */
    public function schedule(Request $request, $id)
    {
        $this->person = Person::whereUserId($id)->first();
        if($this->person->user_id != $id) {
            $this->throwError('Permission denied', 403);
        }
        $this->start_day = Carbon::createFromFormat('Y/m/d',$request->day, $request->user()->tz)->startOfDay();
        $this->end_day = Carbon::createFromFormat('Y/m/d',$request->day, $request->user()->tz)->startOfDay();
        // $this->start_day->setTimezone('UTC');
        //$this->end_day->setTimezone('UTC');
        $this->periods = $request->periods;
        $this->repeat = $request->repeat;

        if($this->repeat['type'] !== 'null') {
            $this->interval = $funcIntervalName = 'P'.$this->repeat['count'].ucfirst(substr($this->repeat['type'], 0, 1));
            $this->end_day->addMonths(6);
            foreach ($this->repeat['weekdays'] as $weekday) {
                $this->weekdays[] = constant('Carbon\Carbon::'.strtoupper($weekday));
            }
            $items = $this->buildRepeatingSchedule();
        } else {
            $items = $this->buildSingleDaySchedule($this->start_day);
        }
        AdvisorsHourlyEvents::saveItems($items, $request->user());
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function getDailySchedule(Request $request, $id)
    {
        $this->person = Person::whereUserId($id)->first();
        $dateStart = Carbon::createFromFormat('Y:m:d', $request->date, $request->user()->tz);
        $dateStart = $dateStart->startOfDay();
        $dateStart->setTimezone('UTC');
        $dateEnd = Carbon::createFromFormat('Y:m:d', $request->date, $request->user()->tz);
        $dateEnd = $dateEnd->endOfDay();
        $dateEnd->setTimezone('UTC');
        $personHourlyEventsQuery = $this->person->hourly_events()
            ->whereBetween('start_time', [$dateStart, $dateEnd])
            ->orderBy('start_time', 'ASC');
        if($request->user()->id != $id) {
            $personHourlyEventsQuery->whereIn('status', [PersonHourlyEvents::STATUS_AVAILABLE, PersonHourlyEvents::STATUS_DRAFT]);
        }
        return $personHourlyEventsQuery->get()->toArray();
    }

    /**
     * @param Request $request
     * @param $id
     * @return array
     */
    public function getMonthlySchedule (Request $request, $id) {
        $this->person = Person::whereUserId($id)->first();
        $dateTime = Carbon::createFromFormat('Y:m:d', $request->date);
        $monthStart = clone $dateTime->startOfMonth();
        $monthStart->setTimezone('UTC');
        $monthEnd = clone $dateTime->endOfMonth();
        $monthEnd->setTimezone('UTC');
        $personHourlyEvents = $this->person->hourly_events()
            ->whereBetween('start_time', [$monthStart, $monthEnd])
            ->get()
            ->toArray();
        $dates = [];
        foreach ($personHourlyEvents as $personHourlyEvent) {
            $date = new Carbon($personHourlyEvent['start_time']);
            $date->setTimezone($request->user()->tz);
            $dateString = $date->startOfDay()->toDateTimeString();
            $dates[$dateString]['date'] = $dateString;
            $dates[$dateString]['statuses'][] = $personHourlyEvent['status'];
            $dates[$dateString]['statuses'] = array_values(array_unique($dates[$dateString]['statuses']));
        }
        return array_values($dates);
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function buildRepeatingSchedule()
    {
        $items = [];
        $interval = new \DateInterval($this->interval);
        $dateRange = new \DatePeriod($this->start_day, $interval ,$this->end_day);

        if($this->repeat['type'] == 'week') {
            foreach ($dateRange as $date) {
                for($i=1; $i<=7; $i++) {
                    if(in_array($date->dayOfWeek, $this->weekdays)) {
                        $dailyItems = $this->buildSingleDaySchedule($date);
                        $items = array_merge($items, $dailyItems);
                    }
                    $date->addDay();
                }
            }
        } elseif($this->repeat['type'] == 'day') {
            foreach ($dateRange as $date) {
                if(in_array($date->dayOfWeek, $this->weekdays)) {
                    $dailyItems = $this->buildSingleDaySchedule($date);
                    $items = array_merge($items, $dailyItems);
                }
            }

        } else {
            foreach ($dateRange as $date) {
                for ($i = 1; $i <= $date->daysInMonth; $i++) {
                    if(in_array($date->dayOfWeek+1, $this->weekdays)) {
                        $dailyItems = $this->buildSingleDaySchedule($date);
                        $items = array_merge($items, $dailyItems);
                    }
                    $date->addDay();
                }
            }
        }
        return $items;
    }

    /**
     * @param Carbon $day
     * @return array
     */
    private function buildSingleDaySchedule(Carbon $day)
    {
        $items = [];
        $user_id = $this->person->user_id;
        foreach ($this->periods as $period){
            $start = clone $day;
            $end = clone $day;
            $start->addHour($period['start_time']['hh'])->addMinute($period['start_time']['mm'])->setTimezone('UTC');
            $end->addHour($period['end_time']['hh'])->addMinute($period['end_time']['mm'])->setTimezone('UTC');
            $abstractDay = clone $start;
            $abstractDay->startOfDay();
            while($end->diffInMinutes($start)){
                $data = [
                    'persons_user_id' => $user_id,
                    'start_time' => $start->toDateTimeString(),
                    'start_minute' => $start->diffInMinutes($abstractDay),
                    'status' => PersonHourlyEvents::STATUS_AVAILABLE
                ];
                $items[] = $data;
                $start->addMinute(env('SLOT_MINUTES_INTERVAL'));
            }
        }
        return $items;

    }

    public function removeSlot(Request $request)
    {
        $event = PersonHourlyEvents::find($request->id);
        if($event->appointment_owner !== null) {
            $event->chat_id = null;
            $event->status = PersonHourlyEvents::STATUS_AVAILABLE;
            $event->save();
            return $event;
        }

        if($event->status == PersonHourlyEvents::STATUS_AVAILABLE) {
            $event->delete();
            return 'deleted';
        }
    }

    public function removeRecurringSlots(Request $request)
    {
        PersonHourlyEvents::where([
            'persons_user_id' => $request->persons_user_id,
            'start_minute' => $request->start_minute,
            'status' => PersonHourlyEvents::STATUS_AVAILABLE
        ])->delete();
        return 'deleted';
    }

    public function preValidate(Request $request)
    {
        return Validator::make($request->all(),
            [
                'date' => 'date',
                'periods.*.start_time' => 'required|time_hh_mm',
                'periods.*.end_time' => 'required|time_hh_mm|is_after_start_time:periods.*.start_time',
                'repeat.type' => Rule::in(["null", 'day', 'week', 'month']),
                'repeat.count' => 'required_with:repeat.type',
                'repeat.weekdays' => 'required_with:repeat.type',
            ],
            [
                'time_hh_mm'    => 'The time period is required and can\'t cross with other periods',
                'is_after_start_time'=> 'The end_time must be a date after start_time.',
                'repeat.weekdays.required_with' => 'The weekdays is required when repeat selected.',
                'repeat.count.required_with' => 'The repeat count is required when repeat selected.'
            ])->validate();
    }

}
