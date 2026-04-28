<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class PlanController extends Controller
{
    /**
     * Visualizza la scheda attuale (is_active = true)
     */
    public function current(Request $request)
    {
        $user = $request->user();

        $plan = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->latest()
            ->first();

        return Inertia::render('client/plan/show', [
            'plan' => $plan ? $this->formatPlanData($plan) : null
        ]);
    }

    /**
     * Visualizza lo storico (is_active = false) con paginazione
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $pastPlans = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->paginate(10);

        // Trasformiamo i dati all'interno della paginazione
        $pastPlans->through(function ($plan) {
            return $this->formatPlanData($plan);
        });

        return Inertia::render('client/history/index', [
            'pastPlans' => $pastPlans
        ]);
    }

    /**
     * Visualizza una singola scheda specifica (usato dallo storico)
     */
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $plan->load(['trainer:id,name', 'exercises']);

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan),
            'isHistory' => true
        ]);
    }

    /**
     * Formatta i dati per il frontend in modo coerente
     */
    private function formatPlanData(Plan $plan): array
    {
        // Raggruppamento Esercizi: Settimana -> Giorno
        $structuredWeeks = $plan->exercises->groupBy('pivot.week_number')->map(function ($week) {
            return $week->groupBy('pivot.day_of_week');
        });

        return [
            'id'          => $plan->id,
            'name'        => $plan->name,
            // Ritorno il nome come STRINGA semplice per evitare crash con .toUpperCase() nel frontend
            'trainer'     => $plan->trainer ? $plan->trainer->name : 'Staff Tecnico',
            'created_at'  => $plan->created_at,
            'start_date'  => Carbon::parse($plan->created_at)->format('d/m/Y'),
            'total_weeks' => $plan->num_weeks,
            'num_weeks'   => $plan->num_weeks,
            'weeks'       => $structuredWeeks,
        ];
    }
}