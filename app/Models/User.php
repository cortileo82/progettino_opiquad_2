<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'role', 'trainer_id', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // 1. Relazione: un cliente ha un solo Personal Trainer
    public function trainer() 
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    // 2. Relazione: un Personal Trainer ha più clienti
    public function clients()
    {
        return $this->hasMany(User::class, 'trainer_id');
    }

    // 3. Relazione: un Personal Trainer può creare più schede
    public function createdPlans()
    {
        return $this->hasMany(Plan::class, 'pt_id');
    }

    // 4. Relazione: un cliente può avere più schede
    public function assignedPlans()
    {
        return $this->hasMany(Plan::class, 'user_id');
    }
}
