<?php
namespace App\Models;

use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Reliese\Database\Eloquent\Model as Eloquent;
/**
 * Class Appointment
 *
 * @property int $id
 * @property int $appointment_id
 * @property int $start_at
 * @property int $end_at
 * @property string $ot_archive_id
 * @property string $download_link
 * @property string $status
 * @property string $ot_session_id
 *
 * @property \App\Models\Appointment $appointment
 * @property \App\Models\PersonHourlyEvents $hourly_events
 *
 * @package App\Models
 */
class AppointmentChat extends Eloquent
{
    const STATUS_DRAFT = 'draft';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';
    const STATUS_PENDING = 'pending';
    const STATUS_PROGRESS = 'progress';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELED = 'canceled';
    const STATUS_PASSED = 'passed';

    public $timestamps = false;

    protected $table = 'appointment_chats';

    protected $casts = [
        'appointment_id' => 'int',
    ];

    protected $with = [
        'archives'
    ];
    protected $hidden = [
        'ot_session_id'
    ];

    protected $fillable = [
        'start_at',
        'end_at',
        'ot_archive_id',
        'download_link',
        'status',
        'appointment_id',
        'ot_session_id'
    ];

    public function appointment()
    {
        return $this->belongsTo(\App\Models\Appointment::class, 'appointment_id', 'id');
    }

    public function messages()
    {
        return $this->hasMany(\App\Models\AppointmentChatMessages::class, 'chat_id');
    }

    public function archives()
    {
        return $this->hasMany(\App\Models\AppointmentChatArchives::class, 'chat_id');
    }

    public function hourly_events()
    {
        return $this->hasMany(
            \App\Models\PersonHourlyEvents::class,
            'chat_id',
            'id'
        );
    }

    public function scopeConfirmed($query)
    {
        return $query->whereStatus(self::STATUS_CONFIRMED);
    }

    public function scopeBeforeMinutes($query, $val)
    {
        return $query->whereBetween('start_at', [Carbon::now()->subMinute($val), Carbon::now()]);
    }

    public function confirm()
    {
        $this->status = self::STATUS_CONFIRMED;
        $this->save();
    }
    public function cancel()
    {
        $this->status = self::STATUS_CANCELED;
        $this->save();
    }
    public function reject()
    {
        $this->status = self::STATUS_REJECTED;
        $this->save();
    }

    public function notifyInterlocutors($notificationType)
    {
        $appointment = $this->appointment;
        $person = $appointment->user_person;
        $user = $appointment->user;

        $userAdjustedStartDate = $user->getAdjustedDate(new \DateTime($this->start_at));
        $personAdjustedStartDate = $person->getAdjustedDate(new \DateTime($this->start_at));

        $userAdjustedEndDate = $user->getAdjustedDate(new \DateTime($this->end_at));
        $personAdjustedEndDate = $person->getAdjustedDate(new \DateTime($this->end_at));

        $userEmailTitle = '';
        $personEmailTitle='';
        $templateName='';

        switch ($notificationType) {
            case 'reminder':
                $templateName = 'appointment_reminder';
                $userEmailTitle = 'Your appointment with '. $person->first_name. ' is coming up!';
                $personEmailTitle = 'Your appointment with '.$user->first_name.' is coming up!';
                break;
        }

        Mail::send(
            'vendor.mail.html.'.$templateName,
            [
                'user'=>$user,
                'appointment' => $appointment,
                'formattedSessionDate' => $userAdjustedStartDate['formattedSessionDate'],
                'formattedStartChatDate' => $userAdjustedStartDate['formattedDate'],
                'formattedEndChatDate' => $userAdjustedEndDate['formattedDate'],
                'timezoneFullName' => $userAdjustedStartDate['timezoneFullName']
            ],
            function ($message) use ($user, $userEmailTitle){
                $message
                    ->to($user->email)
                    ->subject($userEmailTitle)
                    ->from(env('EMAIL_FROM'), env('EMAIL_FROM_NAME'));
            }
        );

        Mail::send(
            'vendor.mail.html.'.$templateName,
            [
                'person' => $person,
                'appointment' => $appointment,
                'formattedSessionDate' => $personAdjustedStartDate['formattedSessionDate'],
                'formattedStartChatDate' => $personAdjustedStartDate['formattedDate'],
                'formattedEndChatDate' => $personAdjustedEndDate['formattedDate'],
                'timezoneFullName' => $personAdjustedEndDate['timezoneFullName']
            ],
            function ($message) use ($person, $personEmailTitle){
                $message
                    ->to($person->email)
                    ->subject($personEmailTitle)
                    ->from(env('EMAIL_FROM'), env('EMAIL_FROM_NAME'));
            }
        );
    }
}
