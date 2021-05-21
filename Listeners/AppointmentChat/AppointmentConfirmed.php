<?php

namespace App\Listeners\AppointmentChat;

use App\Events\Appointment\AppointmentsCountUpdated;
use App\Events\Appointment\ConfirmAppointment;
use App\Jobs\ScheduleBookingSlotStart;
use App\Models\PersonHourlyEvents;
use App\Models\AppointmentChat;
use Carbon\Carbon;

class AppointmentConfirmed
{
    /**
     * Handle the event.
     *
     * @param  ConfirmAppointment  $event
     * @return void
     */
    public function handle(ConfirmAppointment $event)
    {
        $appointment = $event->appointment;
        $user = $appointment->user;
        foreach ($appointment->chats as $chat){
            /** @var AppointmentChat $chat */
            $chat->confirm();
            foreach($chat->hourly_events as $event) {
                $event->status = PersonHourlyEvents::STATUS_CONFIRMED;
                $event->save();
                $job = (new ScheduleBookingSlotStart($event))
                    ->delay(new Carbon($event->start_time));
                dispatch($job);
            }
        }
        event(new AppointmentsCountUpdated($user));

        $appointment->appointmentEmailNotify($appointment, $type = 'appointment_confirm');
    }
}
