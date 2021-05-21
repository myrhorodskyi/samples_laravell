<?php

namespace App\Listeners\Appointment;

use App\Events\Appointment\AppointmentsCountUpdated;
use App\Events\Appointment\RejectAppointment;
use App\Models\Transaction;

class RejectedListener
{
    /**
     * Handle the event.
     *
     * @param  RejectAppointment $event
     * @return void
     * @throws \Exception
     */
    public function handle(RejectAppointment $event)
    {
        $appointment = $event->appointment;
        $user = $appointment->user;
        foreach ($appointment->transactions as $transaction) {
            /** @var Transaction $transaction */
            $transaction->makeRefund();
            $transaction->setRefunded();
        }
        event(new AppointmentsCountUpdated($user));

        $appointment->appointmentEmailNotify($appointment, $type = 'appointment_decline');

    }
}
