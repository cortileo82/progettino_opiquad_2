<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;

class Plan extends Model
{
    use HasFactory;

    /**
     * Gli attributi che vengono aggiunti automaticamente quando il modello
     * viene convertito in JSON (utile per Vue/React con Inertia).
     */
    protected $appends = ['is_active', 'end_date'];

    protected $fillable = [
        'name', 
        'num_weeks', 
        'user_id', 
        'pt_id'
    ];

    /**
     * L'attributo is_active determina se la scheda è ancora valida basandosi sulla data attuale.
     */
    public function getIsActiveAttribute(): bool
    {
        if (!$this->created_at) return true;

        $now = Carbon::now();
        $endDate = $this->created_at->copy()->addWeeks($this->num_weeks);
        
        return $now->lte($endDate);
    }

    /**
     * L'attributo end_date restituisce la data di scadenza calcolata e formattata.
     */
    public function getEndDateAttribute(): string
    {
        if (!$this->created_at) return 'N/A';

        return $this->created_at->copy()
            ->addWeeks($this->num_weeks)
            ->format('d/m/Y');
    }

    /**
     * Relazione: Il cliente a cui appartiene la scheda.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relazione: Il Personal Trainer che ha creato la scheda.
     */
    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pt_id');
    }

    /**
     * Relazione: Gli esercizi associati alla scheda.
     */
    public function exercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'plan_exercises')
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