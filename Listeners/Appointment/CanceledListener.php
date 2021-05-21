<?php

namespace App\Listeners\Appointment;

use App\Events\Appointment\CancelAppointment;
use App\Models\Appointment;
use App\Models\Transaction;

class CanceledListener
{
    /**
     * Handle the event.
     *
     * @param CancelAppointment $event
     * @return void
     */
    public function handle(CancelAppointment $event)
    {
        /** @var Appointment $appointment */
        $appointment = $event->appointment;
        foreach ($appointment->transactions as $transaction) {
            /** @var Transaction $transaction */
            $transaction->makeRefund();
            $transaction->setRefunded();
        }
    }
}
