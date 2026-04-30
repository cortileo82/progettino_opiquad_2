<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'muscle_group_id'];
    
    // Per la paginazione nei controller
    protected $perPage = 10;

    public function muscleGroup(): BelongsTo
    {
        return $this->belongsTo(MuscleGroup::class, 'muscle_group_id');
    }

    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(Plan::class, 'plan_exercises')
            ->withPivot(['day_of_week', 'week_number', 'sets', 'reps', 'weight_kg', 'rest_time', 'order'])
            ->orderByPivot('order', 'asc') 
            ->withTimestamps();
    }

    // Scope di Ricerca Centralizzato
    public function scopeSearchWithMuscleGroup($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhereHas('muscleGroup', function ($sub) use ($search) {
                  $sub->where('name', 'like', "%{$search}%");
              });
        });
    }
}