<?php

/**
 * Created by Reliese Model.
 * Date: Sat, 08 Jul 2017 12:10:22 +0000.
 */

namespace App\Models;

use Reliese\Database\Eloquent\Model as Eloquent;
use Yadakhov\InsertOnDuplicateKey;
use Elasticquent\ElasticquentTrait as Elasticquent;

/**
 * Class WorkExperience
 *
 * @property int $id
 * @property int $persons_user_id
 * @property int $start_minute
 * @property \Carbon\Carbon $start_time
 * @property string $status
 * @property \Carbon\Carbon $deleted_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property \App\Models\Person $person
 *
 * @package App\Models
 */
class PersonHourlyEvents extends Eloquent
{
	use \Illuminate\Database\Eloquent\SoftDeletes,
        InsertOnDuplicateKey,
        Elasticquent;

    const STATUS_AVAILABLE = 'available';
    const STATUS_UNAVAILABLE = 'unavailable';
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_PROGRESS = 'progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CONFIRMED = 'confirmed';


    protected $casts = [
		'persons_user_id' => 'int'
	];

    protected $fillable = [
        'start_time',
        'start_minute',
        'status',
    ];

    protected $touches = [
        'person'
    ];

    protected $appends = [
        'appointment_owner'
    ];

    protected $mappingProperties = [
        'start_time' => [
            'type' => 'date'
        ],
        'start_minute' => [
            'type' => 'string'
        ],
    ];

	public function person()
	{
		return $this->belongsTo(\App\Models\Person::class, 'persons_user_id', 'user_id');
	}
    public function getTypeName()
    {
        return 'hourly_events';
    }

    /**
     * Users who share given role
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function chat()
    {
        return $this->belongsTo(\App\Models\AppointmentChat::class, 'chat_id', 'id');
    }

    public static function saveItems($items,User $user) {
        self::replace($items);
        $user->touch();
    }

    public function getAppointmentOwnerAttribute()
    {
        if($this->chat) {
            return $this->chat->appointment->user;
        }
        return null;
    }
}
