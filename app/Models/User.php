<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'role', 'trainer_id', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

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
     * Rinominiamo questa funzione in 'trainer' per compatibilità con il resto del sistema.
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