<?php

namespace App\Listeners\AppointmentChat;

use App\Events\Appointment\AppointmentsCountUpdated;
use App\Events\Appointment\CancelAppointment;
use App\Models\PersonHourlyEvents;
use App\Models\AppointmentChat;

class AppointmentCanceled
{
    /**
     * Handle the event.
     *
     * @param  CancelAppointment  $event
     * @return void
     */
    public function handle(CancelAppointment $event)
    {
        $appointment = $event->appointment;
        $user = $appointment->user;
        foreach ($appointment->chats as $chat){
            /** @var AppointmentChat $chat */
            $chat->cancel();
            $events = $chat->hourly_events;
            foreach ($events as $event){
                $event->chat()->dissociate();
                $event->status =  PersonHourlyEvents::STATUS_AVAILABLE;
                $event->save();
            }
        }
        event(new AppointmentsCountUpdated($user));

        $appointment->appointmentEmailNotify($appointment, $type = 'appointment_cancel');

    }
}
