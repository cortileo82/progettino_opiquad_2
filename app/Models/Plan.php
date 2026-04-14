<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; // Importante per la gestione delle date

class Plan extends Model
{
    use HasFactory;

    // Includiamo gli attributi calcolati quando il modello viene convertito in JSON/Array per Inertia
    protected $appends = ['is_active', 'end_date'];

    protected $fillable = [
        'name', 
        'num_weeks', 
        'user_id', 
        'pt_id'
    ];

    /**
     * ATTRIBUTO: is_active
     * Determina se la scheda è ancora valida basandosi sulla data di creazione e le settimane.
     */
    public function getIsActiveAttribute()
    {
        $now = Carbon::now();
        // Calcola la fine: data creazione + numero settimane
        $endDate = $this->created_at->copy()->addWeeks($this->num_weeks);
        
        return $now->between($this->created_at, $endDate);
    }

    /**
     * ATTRIBUTO: end_date
     * Restituisce la data di scadenza formattata (es: 14/05/2026).
     */
    public function getEndDateAttribute()
    {
        return $this->created_at->copy()->addWeeks($this->num_weeks)->format('d/m/Y');
    }

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
        // NOTA: Assicurati che il nome della tabella pivot sia corretto nel tuo DB.
        // Nel tuo codice precedente era 'plan_exercises'.
        return $this->belongsToMany(Exercise::class, 'plan_exercises')
                    ->withPivot('day_of_week', 'sets', 'reps', 'rest_time')
                    ->withTimestamps();
    }
}