<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'name', 'num_weeks', 'user_id', 'pt_id'];
    // 1. Relazione: la scheda è di un cliente
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 2. Relazione: la scheda è fatta da un Personal Trainer
    public function trainer()
    {
        return $this->belongsTo(User::class, 'pt_id');
    }

    // 3. Relazione: alla scheda sono associati degli esercizi
    public function exercises()
    {
        // withPivot dice a Laravel di "pescare" anche le serie, le ripetizioni e i giorni dalla tabella ponte.
        return $this->belongsToMany(Exercise::class, 'plan_exercises')
                    ->withPivot('day_of_week', 'sets', 'reps', 'rest_time')
                    ->withTimeStamps();
    }
}
