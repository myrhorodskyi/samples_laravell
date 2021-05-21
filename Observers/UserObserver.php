<?php

namespace App\Observers;

use App\Jobs\UserReindex;
use App\Jobs\UserRemoveIndex;
use App\Models\User;

class UserObserver {

    function __construct()
    {
    }

    /**
     * Listen to the User creating event.
     *
     * @param  User  $user
     * @return void
     */
    public function creating(User $user)
    {
    }
    /**
     * Listen to the User created event.
     *
     * @param  User  $user
     * @return void
     */
    public function created(User $user)
    {
        if($user->is_confirmed && $user->isPerson() && $user->person->isApproved()){
            $user->person->load('hourly_events');
            $user->addToIndex();
        }
    }
    /**
     * Listen to the User updating event.
     *
     * @param  User  $user
     * @return void
     */
    public function updating(User $user)
    {
    }
    /**
     * Listen to the User updated event.
     *
     * @param  User  $user
     * @return void
     */
    public function updated(User $user)
    {
        if($user->is_confirmed && $user->isPerson() && $user->person->isApproved()) {
            $job = (new UserReindex($user));
            dispatch($job);
        } else {
            if($user->isDocument()){
                $job = (new UserRemoveIndex($user));
                dispatch($job);
            }
        }
    }
    /**
     * Listen to the User saving event.
     *
     * @param  User  $user
     * @return void
     */
    public function saving(User $user)
    {
    }
    /**
     * Listen to the User saved event.
     *
     * @param  User  $user
     * @return void
     */
    public function saved(User $user)
    {
        if($user->is_confirmed && $user->isPerson() && $user->person->isApproved()) {
            $job = (new UserReindex($user));
            dispatch($job);
        } else {
            if($user->isDocument()){
                $job = (new UserRemoveIndex($user));
                dispatch($job);
            }
        }
    }
    /**
     * Listen to the User deleting event.
     *
     * @param  User  $user
     * @return void
     */
    public function deleting(User $user)
    {
    }
    /**
     * Listen to the User deleted event.
     *
     * @param  User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        if($user->isDocument()){
            $job = (new UserRemoveIndex($user));
            dispatch($job);
        }
    }
    /**
     * Listen to the User restoring event.
     *
     * @param  User  $user
     * @return void
     */
    public function restoring(User $user)
    {
    }
    /**
     * Listen to the User restored event.
     *
     * @param  User  $user
     * @return void
     */
    public function restored(User $user)
    {
        if($user->is_confirmed && $user->isPerson() && $user->person->isApproved()) {
            $user->person->load('hourly_events');
            $user->addToIndex();
        }
    }
}
