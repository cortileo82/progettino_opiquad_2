<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Exercise extends Model
{
    use HasFactory;

    /**
     * I campi che possono essere assegnati massivamente.
     */
    protected $fillable = [
        'name',
        'description',
        'muscle_group',
    ];

    /**
     * Relazione Molti-a-Molti con la tabella Plans.
     * 
     * Un esercizio può essere presente in molte schede diverse.
     * Usiamo withPivot per accedere ai dati extra (day_of_week, sets, reps) 
     * presenti nella tabella ponte 'plan_exercises'.
     */
    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(Plan::class, 'plan_exercises')
                    ->withPivot('day_of_week', 'sets', 'reps')
                    ->withTimestamps();
    }
}