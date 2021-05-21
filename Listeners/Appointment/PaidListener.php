<?php

namespace App\Listeners\Appointment;

use App\Events\Appointment\AppointmentsCountUpdated;
use App\Events\Appointment\Paid;
use App\Models\PersonHourlyEvents;
use App\Models\Appointment;
use App\Models\AppointmentChat;
use Illuminate\Support\Facades\Auth;
use OpenTok\ArchiveMode;
use OpenTok\MediaMode;
use Tomcorbett\OpentokLaravel\Facades\OpentokApi;

class PaidListener
{
    /**
     * Handle the event.
     *
     * @param  Paid $event
     * @return void
     * @throws \Exception
     */
    public function handle(Paid $event)
    {
        $stripeEvent = $event->stripeEvent;
        $appointment = $event->appointment;
        $appointment->status = Appointment::STATUS_PENDING;
        $appointment->save();

        $user = Auth::user();
        if (!$user) {
            $user = $appointment->user;
        }

        foreach ($appointment->chats as $chat){
            /** @var AppointmentChat $chat */
            $chat->status = AppointmentChat::STATUS_PENDING;
            $sessionOptions = array(
                'archiveMode' => ArchiveMode::MANUAL,
                'mediaMode' => MediaMode::ROUTED,
                'hasVideo' => $appointment->type === 'video',
                'hasAudio' => true
            );
            $session    = OpentokApi::createSession($sessionOptions);
            $sessionId  = $session->getSessionId();
            if (empty($sessionId)) {
                throw new \Exception("An open tok session could not be created");
            }
            $chat->ot_session_id = $sessionId;
            $chat->save();
            $chat->hourly_events()->update(['status' => PersonHourlyEvents::STATUS_PENDING]);

        }
        event(new AppointmentsCountUpdated($user));

        $appointment->appointmentEmailNotify($appointment, $type = 'appointment_booking', $stripeEvent ? ['stripeEvent' => $stripeEvent] : null);
    }
}
