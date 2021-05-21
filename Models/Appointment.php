<?php
namespace App\Models;


use Reliese\Database\Eloquent\Model as Eloquent;
/**
 * Class Appointment
 *
 * @property int $id
 * @property int $user_id
 * @property int $persons_user_id
 * @property int $type
 * @property string $description
 * @property string $status
 * @property int $cost
 * @property int $additional_amount
 * @property int $discount_amount
 * @property int $credits_amount
 * @property int $total_amount
 *
 * @property \App\Models\Person $person
 * @property \App\Models\User $user
 * @property \App\Models\AppointmentChat $chats
 * @property \App\Models\Billing\Discount $applied_discount
 * @property \App\Models\Transaction $transactions
 *
 * @package App\Models
 */
class Appointment extends Eloquent
{
    const STATUS_DRAFT = 'draft';
    const STATUS_PAYMENT = 'payment';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';
    const STATUS_PENDING = 'pending';
    const STATUS_PROGRESS = 'progress';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELED = 'canceled';
    const STATUS_PASSED = 'passed';

    public $timestamps = false;

    protected $casts = [
        'user_id' => 'int',
        'persons_user_id' => 'int',
        'cost' => 'int',
        'additional_amount' => 'int',
        'discount_amount' => 'int',
        'credits_amount' => 'int',
    ];

    protected $appends = [
        'total_amount',
        'nearest_chat',
        'has_review',
        'processing_fee'
    ];
    protected $fillable = [
        'description',
        'type',
        'cost',
        'additional_amount',
        'discount_amount',
        'credits_amount',
        'status',
    ];

    protected $with = [
        'chats',
        'user',
        'user_person',
        'applied_discount'
    ];

    public function user_person()
    {
        return $this->belongsTo(\App\Models\User::class, 'persons_user_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
    public function chats()
    {
        return $this->hasMany(\App\Models\AppointmentChat::class);
    }

    public function review()
    {
        return $this->hasOne(\App\Models\Review::class);
    }

    public function applied_discount() {
        return $this->hasOne(\App\Models\Billing\Discount::class);
    }

    public function getNearestChatAttribute()
    {
        return $this->chats()->beforeMinutes(10)->confirmed()->first();
    }

    public function getTotalAmountAttribute()
    {
        return $this->cost + $this->additional_amount;
    }

    public function getProcessingFeeAttribute() {
        return (int) config('services.stripe.processing_fee');
    }

    public function getHasReviewAttribute()
    {
        return $this->review()->count() > 0;
    }
    public function transactions()
    {
        return $this->hasMany(\App\Models\Transaction::class, 'appointment_id', 'id');
    }

    public function scopeForUserRole($query, $role, $user_id)
    {
        switch($role) {
            case Role::USER:
                $query->wherePersonsUserId($user_id);

                break;
            case Role::PERSON:
                $query->whereUserId($user_id);
                break;
            default:
                $query->whereUserId($user_id)
                    ->orWhere('persons_user_id', '=', $user_id);
        }
        return $query;
    }

    public function scopeOrderByDate($query, $order='desc')
    {
        $query->join('appointment_chats', 'appointment_chats.appointment_id', '=', 'appointments.id')
            ->orderBy('appointment_chats.start_at', $order);
    }

    public function checkIsPaid()
    {
        return $this->transactions()->whereIn('status', [Transaction::STATUS_PENDING, Transaction::STATUS_REFUNDED, Transaction::STATUS_ERROR])->count() === 0;
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

    public function isFreeRate()
    {
        return $this->cost === 0;
    }

    public function isNeedStripePayment()
    {
        return ($this->total_amount - $this->discount_amount - $this->credits_amount) > 0;
    }

    public function canBeConfirmed(User $user)
    {
        return $this->persons_user_id === $user->id;
    }

    public function canBeCanceled(User $user)
    {
        return $this->user_id === $user->id;
    }

    public function canBeRescheduled(User $user)
    {
        return $this->user_id === $user->id;
    }

    public function canBeRejected(User $user)
    {
        return $this->persons_user_id === $user->id;
    }

    public function search_in_timezones($timezoneFullNameArray, $abbreviation, $timeZoneOffset)
    {
        foreach ($timezoneFullNameArray as $data)
        {
            if ($data['abbr'] == $abbreviation && $data['offset'] == $timeZoneOffset)
                return $data['timeZoneFullName'];
        }
    }

    private function formatedStartChatDayTimeZone(User $user, $formatedStartChatDate, $formatedEndChatDate) {
        $formatedStartChatDate->setTimezone($user->tz);
        $timeZoneOffset = $formatedStartChatDate->format('P');

        $formatedStartChatDate = date('g:i A', strtotime($formatedStartChatDate));

        $formatedEndChatDate->setTimezone($user->tz);
        $formatedEndChatDate = date('g:i A', strtotime($formatedEndChatDate));

        $formatedSesionDate = date('F d, Y', strtotime($formatedStartChatDate));

        $dt = new \DateTime($formatedStartChatDate, new \DateTimeZone($user->tz));
        $abbreviation = $dt->format('T'); // SST

        $timezoneFullNameArray = config('custom_tz_names');
        $timezoneFullName = $this->search_in_timezones($timezoneFullNameArray, $abbreviation, $timeZoneOffset);

        $data['formatedSesionDate'] = $formatedSesionDate;
        $data['formatedStartChatDate'] = $formatedStartChatDate;
        $data['formatedEndChatDate'] = $formatedEndChatDate;
        $data['timezoneFullName'] = $timezoneFullName;
        return $data;
    }
}
