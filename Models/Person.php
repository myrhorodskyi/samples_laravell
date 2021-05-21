<?php
namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Reliese\Database\Eloquent\Model as Eloquent;
use \Illuminate\Database\Eloquent\SoftDeletes;
use Elasticquent\ElasticquentTrait as Elasticquent;
/**
 * Class Person
 *
 * @property int $user_id
 * @property string $tagline
 * @property string $bio
 * @property int $rate_id
 * @property int $country_id
 * @property int $invitation_codes_id
 * @property float $rating
 * @property string $deleted_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property \App\Models\User $user
 * @property \App\Models\Country $country
 * @property \App\Models\InvitationCode $invitation_code
 * @property \App\Models\Rate $rate
 * @property \Illuminate\Database\Eloquent\Collection $industries
 * @property \Illuminate\Database\Eloquent\Collection $offers
 * @property \Illuminate\Database\Eloquent\Collection $skills
 * @property \Illuminate\Database\Eloquent\Collection $booking_hours
 * @property \Illuminate\Database\Eloquent\Collection $education
 * @property \Illuminate\Database\Eloquent\Collection $media
 * @property \Illuminate\Database\Eloquent\Collection $reviews
 * @property \Illuminate\Database\Eloquent\Collection $hourly_events
 * @property \App\Models\SavedPerson $saved_person
 * @property \Illuminate\Database\Eloquent\Collection $work_experiences
 *
 * @package App\Models
 */
class Person extends Eloquent
{
	use SoftDeletes, Elasticquent;
	public $incrementing = false;

	protected $casts = [
		'user_id' => 'int',
		'rate_id' => 'int',
		'country_id' => 'int',
		'invitation_codes_id' => 'int',
		'rating' => 'float',
	];

	protected $appends = [
	    'reviews_count',
        'is_saved',
        'recommend',
        'prepared',
        'knowledgeable',
        'useful',
        'consulting_hours',
        'personal_hash'
    ];

	protected $fillable = [
		'tagline',
		'bio',
		'rating',
        'approved_at',
        'linkedin',
	];

    protected $with = [
        'industries',
        'rate',
        'country',
        'offers',
        'skills',
        'education',
        'media',
        'work_experiences',
        'reviews',
        'interested_industries'
    ];

    protected $touches = [
        'user'
    ];

	protected $primaryKey = 'user_id';

    public function getReviewsCountAttribute()
    {
        return $this->reviews()->count();
    }

    public function getIsSavedAttribute()
    {
        $authUser = Auth::user();
        if(!$authUser) return false;
        return $this->saved_person()->whereUserId($authUser->id)->first() != null;
    }

    public function getRecommendAttribute()
    {
        return floor($this->reviews()
                    ->selectRaw('avg(recommend) as value')
                    ->first()->value*100)/100*10;
    }
    public function getConsultingHoursAttribute ()
    {
        $slotsCount = $this->hourly_events()->whereStatus(PersonsHourlyEvents::STATUS_COMPLETED)->count();
        return $slotsCount * (env('SLOT_MINUTES_INTERVAL') / 60);
    }

    public function getPersonalHashAttribute()
    {
        return \Hashids::encode($this->user_id);
    }

    public function getPreparedAttribute()
    {
       return round($this->reviews()->selectRaw('avg(prepared) as value')->first()->value, 1);
    }


    public function getKnowledgeableAttribute()
    {
        return round($this->reviews()->selectRaw('avg(knowledgeable) as value')->first()->value, 1);
    }

    public function getUsefulAttribute()
    {
        return round($this->reviews()->selectRaw('avg(useful) as value')->first()->value, 1);
    }

    public function approve()
    {
        $this->approved_at = date("Y-m-d H:i:s");
        $this->save();
    }

	public function user()
	{
		return $this->belongsTo(\App\Models\User::class);
	}

	public function country()
	{
		return $this->belongsTo(\App\Models\Country::class);
	}

	public function invitation_code()
	{
		return $this->belongsTo(\App\Models\InvitationCode::class, 'invitation_codes_id');
	}

	public function rate()
	{
		return $this->belongsTo(\App\Models\Rate::class);
	}

	public function industries()
	{
		return $this->belongsToMany(\App\Models\Industry::class, 'person_industry', 'persons_user_id');
	}

	public function offers()
	{
		return $this->belongsToMany(\App\Models\Offer::class, 'person_offer', 'persons_user_id');
	}

	public function skills()
	{
		return $this->belongsToMany(\App\Models\Skill::class, 'person_skill', 'persons_user_id');
	}

	public function education()
	{
		return $this->hasMany(\App\Models\Education::class, 'persons_user_id', 'user_id');
	}

	public function media()
	{
		return $this->hasMany(\App\Models\Media::class, 'persons_user_id', 'user_id');
	}

	public function appointments()
	{
		return $this->hasMany(\App\Models\Appointment::class, 'persons_user_id', 'user_id');
	}

	public function reviews()
	{
		return $this->hasMany(\App\Models\Review::class, 'persons_user_id', 'user_id');
	}

	public function saved_person()
	{
        return $this->belongsToMany(\App\Models\User::class, 'saved_persons', 'persons_user_id');
	}

	public function work_experiences()
	{
		return $this->hasMany(\App\Models\WorkExperience::class, 'persons_user_id', 'user_id');
	}

    public function hourly_events()
    {
        return $this->hasMany(\App\Models\PersonsHourlyEvents::class, 'persons_user_id', 'user_id');
    }

    public function scopeApproved($query)
    {
        return $query->whereNotNull('approved_at');
    }
    public function isApproved()
    {
        return !empty($this->approved_at);
    }

    public function interested_industries()
    {
        return $this->belongsToMany(\App\Models\Industry::class, 'person_industry', 'persons_user_id');
    }
}
