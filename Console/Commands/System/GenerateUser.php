<?php

namespace App\Console\Commands\System;

use App\Models\Role;
use App\Models\User;
use App\Models\Person;
use App\Events\ApprovePerson;
use Illuminate\Console\Command;

class GenerateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:user {--email=} {--password=insecure-pass} {--roles=user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $email      = $this->option('email');
        $password   = $this->option('password');
        $roles      = explode(',', $this->option('roles'));

        $person = factory(User::class)->create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => $email,
            'password' => bcrypt($password),
        ]);

        if(array_search(Role::USER, $roles) !== false) {
            $person->roles()->attach(Role::user());
        }
        if(array_search(Role::PERSON, $roles) !== false) {
            $person->roles()->attach(Role::person());
            $rateCount = \App\Models\Rate::all()->count();

            $person = new Person();
            $person->user_id = $person->id;
            $person->tagline = 'Sample tagline';
            $person->bio = 'Short bio';
            $person->rate_id = rand(1, $rateCount);
            $person->linkedin = 'https://www.linkedin.com';
            $person->country_id = \App\Models\Country::take(1)
                    ->inRandomOrder()
                    ->get(['id'])->toArray()[0]['id'];
            $person->save();
        }
        if(array_search(Role::ADMIN, $roles) !== false) {
            $person->roles()->attach(Role::admin());
        }
        $person->save();
    }
}
