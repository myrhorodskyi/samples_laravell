<?php

namespace App\Jobs;

use App\Models\PersonHourlyEvents;
use App\Events\Chat\Completed as ChatCompleted;
use App\Events\Appointment\Completed as AppointmentCompleted;
use App\Models\Appointment;
use App\Models\AppointmentChat;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ScheduleBookingSlotEnd implements ShouldQueue
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
        $this->hourlyEvent->status = PersonHourlyEvents::STATUS_COMPLETED;
        $this->hourlyEvent->save();
        /** @var AppointmentChat $chat */
        $chat = $this->hourlyEvent->chat;
        $totalEventsInChatCount = $chat->hourly_events()->count();
        $completedEventsInChatCount = $chat->hourly_events()->whereStatus(PersonHourlyEvents::STATUS_COMPLETED)->count();
        if($totalEventsInChatCount === $completedEventsInChatCount){
            $chat->status = AppointmentChat::STATUS_COMPLETED;
            $chat->save();
            event(new ChatCompleted($chat));
            $delayTime = Carbon::now();
            $delayTime->addMinutes(2);
            $job = (new ScheduleForceDisconnect($chat))
                ->delay($delayTime);
            dispatch($job);
        }

        /** @var Appointment $appointment */
        $appointment = $chat->appointment;
        $totalChatsInAppointmentCount = $appointment->chats()->count();
        $completedChatsInAppointmentCount = $appointment->chats()->whereStatus(AppointmentChat::STATUS_COMPLETED)->count();
        if($totalChatsInAppointmentCount === $completedChatsInAppointmentCount){
            $appointment->status = Appointment::STATUS_COMPLETED;
            $appointment->save();
            event(new AppointmentCompleted($appointment));
        }
    }
}
