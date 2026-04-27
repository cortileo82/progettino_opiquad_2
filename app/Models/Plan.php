<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Plan extends Model
{
    use HasFactory;

    protected $appends = ['end_date']; 

    protected $fillable = ['name', 'num_weeks', 'user_id', 'pt_id', 'is_active'];

    // Si castano i booleani per sicurezza, 
    // così Laravel converte in automatico gli 1/0 di MySQL in veri true/false per React
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getEndDateAttribute(): string
    {
        if (!$this->created_at) return 'N/A';
        // copy() è fondamentale per non alterare la data di creazione originale
        return $this->created_at->copy()->addWeeks($this->num_weeks)->format('d/m/Y');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pt_id');
    }

    public function exercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'plan_exercises')
            ->withPivot(['day_of_week', 'week_number', 'sets', 'reps', 'rest_time', 'weight_kg'])
            ->withTimestamps();
    }
}