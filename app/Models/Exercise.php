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
     * Relazione PRINCIPALE (Snake Case)
     * Usata dai nuovi controller e dal frontend React.
     */
    public function muscle_group(): BelongsTo
    {
        return $this->belongsTo(MuscleGroup::class, 'muscle_group_id');
    }

    /**
     * ALIAS DI COMPATIBILITÀ (Camel Case)
     * Questo metodo serve a risolvere l'errore "RelationNotFoundException [muscleGroup]".
     * Qualsiasi parte del sistema che cerca ancora il vecchio nome verrà reindirizzata qui.
     */
    public function muscleGroup(): BelongsTo
    {
        return $this->muscle_group();
    }

    /**
     * Relazione Molti-a-Molti con la tabella Plans.
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
}