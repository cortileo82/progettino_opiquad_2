<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exercise extends Model
{
    use HasFactory;

    /**
     * I campi che possono essere assegnati massivamente.
     */
    protected $fillable = [
        'name',
        'description',
        'muscle_group_id',
    ];

    /**
     * Relazione Molti-a-Molti con la tabella Plans.
     * * Un esercizio può essere presente in molte schede diverse.
     * Sincronizziamo i campi pivot con quelli definiti nel modello Plan.
     */
    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(Plan::class, 'plan_exercises')
            ->withPivot([
                'day_of_week', 
                'week_number', 
                'sets', 
                'reps', 
                'rest_time'   
            ])
            ->withTimestamps();
    }

    public function muscleGroup(): BelongsTo
    {
        return $this->belongsTo(MuscleGroup::class);
    }
}