<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanExercise extends Model
{
    use HasFactory;

    // Specifichiamo il nome della tabella perché è al plurale e ha l'underscore
    protected $table = 'plan_exercises';

    // Permettiamo a Laravel di scrivere in questi campi
    protected $fillable = [
        'plan_id',
        'exercise_id',
        'day_of_week',
        'sets',
        'reps',
        'weight_kg',
    ];

    // Una riga della tabella appartiene a un esercizio specifico
    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }

    // Una riga della tabella appartiene a una scheda specifica
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}