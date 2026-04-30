<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // 1. Logica di raggruppamento protetta e centralizzata
        $structuredWeeks = $this->whenLoaded('exercises', function () {
            return $this->exercises->groupBy('pivot.week_number')->map(function ($week) {
                return $week->groupBy('pivot.day_of_week');
            });
        });

        // 2. Gestione sicura della relazione col Trainer
        $trainerName = $this->relationLoaded('trainer') && $this->trainer 
            ? $this->trainer->name 
            : 'Staff Tecnico';

        return [
            'id' => $this->id,
            'name' => $this->name,
            'trainer' => $trainerName,
            'created_at' => $this->created_at,
            'start_date' => $this->created_at ? Carbon::parse($this->created_at)->format('d/m/Y') : null,
            'total_weeks' => $this->num_weeks,
            'num_weeks' => $this->num_weeks,
            'weeks' => $structuredWeeks,
        ];
    }
}