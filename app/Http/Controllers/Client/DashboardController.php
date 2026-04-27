<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // 1. Estrazione sicura: carichiamo il trainer ma solo ID e Nome per risparmiare memoria
        $user = $request->user()->load('trainer:id,name');

        // 2. Query SEPARATA per la Scheda Attiva (Veloce, estrae solo 1 record)
        $activePlan = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->latest()
            ->first();

        // 3. Query SEPARATA per lo Storico: NON carichiamo gli "exercises" per le schede vecchie!
        $pastPlans = Plan::with('trainer:id,name')
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->get();

        return Inertia::render('client/dashboard', [
            'assignedTrainer' => $user->trainer ? $user->trainer->name : 'Nessun Trainer',
            
            // Smistiamo la formattazione a metodi specializzati
            'activePlan' => $activePlan ? $this->formatActivePlan($activePlan) : null,
            'pastPlans'  => $pastPlans->map(fn($plan) => $this->formatPastPlan($plan)),
        ]);
    }

    /**
     * Formatta la scheda attiva, includendo il calcolo complesso e gli esercizi
     */
    private function formatActivePlan(Plan $plan): array
    {
        // Ottimizzazione del calcolo con min() al posto dell'if()
        $daysPassed = $plan->created_at->diffInDays(now());
        $currentWeek = min((int) floor($daysPassed / 7) + 1, $plan->num_weeks);

        return [
            'id'           => $plan->id,
            'name'         => $plan->name,
            'is_active'    => $plan->is_active,
            'start_date'   => $plan->created_at->format('d/m/Y'),
            'end_date'     => $plan->end_date,
            'current_week' => $currentWeek,
            'total_weeks'  => $plan->num_weeks,
            'weekly_days'  => $plan->exercises->where('pivot.week_number', $currentWeek)->groupBy('pivot.day_of_week')->toArray(),
            'all_days'     => $plan->exercises->groupBy('pivot.day_of_week')->toArray(),
        ];
    }

    /**
     * DTO leggero per lo storico: omette i calcoli pesanti e le liste di esercizi
     */
    private function formatPastPlan(Plan $plan): array
    {
        return [
            'id'           => $plan->id,
            'name'         => $plan->name,
            'is_active'    => $plan->is_active,
            'start_date'   => $plan->created_at->format('d/m/Y'),
            'end_date'     => $plan->end_date,
            'total_weeks'  => $plan->num_weeks,
        ];
    }
}