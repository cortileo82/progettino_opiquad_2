<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_PT = 'pt';
    public const ROLE_CLIENT = 'client';

    /**
     * I campi che possono essere assegnati massivamente.
     * Ho aggiunto tutti i campi necessari per il form di modifica.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'trainer_id',
        'profile_photo_path', // Utile se userai le foto profilo
    ];

    /**
     * I campi che devono essere nascosti nelle risposte JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * I cast degli attributi.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Relazione: Un cliente appartiene a un Personal Trainer.
     */
    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    /**
     * Relazione: Un Personal Trainer ha molti clienti.
     */
    public function clients(): HasMany
    {
        return $this->hasMany(User::class, 'trainer_id');
    }

    /**
     * Relazione: Un Personal Trainer crea molte schede (Workout Plans).
     */
    public function createdPlans(): HasMany
    {
        return $this->hasMany(Plan::class, 'pt_id');
    }

    /**
     * Relazione: Un cliente ha molte schede assegnate.
     */
    public function assignedPlans(): HasMany
    {
        return $this->hasMany(Plan::class, 'user_id');
    }
}