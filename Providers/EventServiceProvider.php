<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        \App\Events\ApprovePerson::class => [
            \App\Listeners\ApprovePerson::class,
            \App\Listeners\ApprovePersonsSkills::class,
            \App\Listeners\ApprovePersonsSchools::class,
            \App\Listeners\ApprovePersonsCompanies::class,
            \App\Listeners\ApprovePersonsPositions::class,
        ],
        \App\Events\PersonRatingEvent::class => [
            \App\Listeners\PersonRatingListener::class
        ],
        \App\Events\Appointment\Requested::class => [
        ],
        \App\Events\Appointment\Paid::class => [
            \App\Listeners\Appointment\PaidListener::class
        ],
        \App\Events\Appointment\ConfirmAppointment::class => [
            \App\Listeners\AppointmentChat\AppointmentConfirmed::class,
        ],
        \App\Events\Appointment\CancelAppointment::class => [
            \App\Listeners\AppointmentChat\AppointmentCanceled::class,
            \App\Listeners\Appointment\CanceledListener::class
        ],
        \App\Events\Appointment\RejectAppointment::class => [
            \App\Listeners\AppointmentChat\AppointmentRejected::class,
            \App\Listeners\Appointment\RejectedListener::class
        ],
        \App\Events\Appointment\AppointmentsCountUpdated::class => [

        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }
}
