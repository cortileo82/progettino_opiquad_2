<?php 

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_PT = 'pt';
    public const ROLE_CLIENT = 'client';

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        // 'avatar',
        'role',
        'trainer_id',
        'stripe_id',
        'is_premium',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected $perPage = 10;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_premium' => 'boolean',
        ];
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function clients(): HasMany
    {
        return $this->hasMany(User::class, 'trainer_id');
    }

    public function createdPlans(): HasMany
    {
        return $this->hasMany(Plan::class, 'pt_id');
    }

    public function assignedPlans(): HasMany
    {
        return $this->hasMany(Plan::class, 'user_id');
    }

    public function scopeIsClient($query)
    {
        return $query->role(self::ROLE_CLIENT);
    }

    public function scopeFree($query)
    {
        return $query->whereNull('trainer_id');
    }

    public function scopeAssignedTo($query, $trainerId)
    {
        return $query->where('trainer_id', $trainerId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
}