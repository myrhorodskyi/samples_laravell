<?php

namespace App\Jobs;

use App\Events\Chat\Started as ChatStarted;
use App\Models\PersonHourlyEvents;
use App\Models\Appointment;
use App\Models\AppointmentChat;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\App;

class ScheduleBookingSlotStart implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $hourlyEvent;
    /**
     * Create a new job instance.
     *
     * @param PersonHourlyEvents $hourlyEvent
     */
    public function __construct(PersonHourlyEvents $hourlyEvent)
    {
        $this->hourlyEvent = $hourlyEvent;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if($this->hourlyEvent->status !== PersonHourlyEvents::STATUS_CONFIRMED){
            return;
        }
        $this->hourlyEvent->status = PersonHourlyEvents::STATUS_PROGRESS;
        $this->hourlyEvent->save();

        /** @var AppointmentChat $chat */
        $chat = $this->hourlyEvent->chat;
        if($chat->status === AppointmentChat::STATUS_CONFIRMED){
            $chat->status = AppointmentChat::STATUS_PROGRESS;
            $chat->save();
            event(new ChatStarted($chat));
        }
        $appointment = $chat->appointment;
        /** @var Appointment $appointment */
        if($appointment->status === Appointment::STATUS_CONFIRMED){
            $appointment->status = Appointment::STATUS_PROGRESS;
            $appointment->save();
        }
        $delayTime = new Carbon($this->hourlyEvent->start_time);
        $delayTime->addMinutes(env('SLOT_MINUTES_INTERVAL'));
        $job = (new ScheduleBookingSlotEnd($this->hourlyEvent))
            ->delay($delayTime);
        dispatch($job);
    }
}
