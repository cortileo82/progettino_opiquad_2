<?php namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class PlanController extends Controller
{
    /**
     * Dashboard: Mostra la scheda attiva
     */
    public function current(Request $request)
    {
        $user = $request->user();
        
        // Recupero ottimizzato: non si scarica tutto il DB in RAM per filtrarlo in PHP.
        // Si lascia che sia il Database a fare il lavoro sporco.
        $plan = Plan::with(['trainer', 'exercises'])
            ->where('user_id', $user->id)
            ->get()
            ->first(function ($p) {
                // Si sfrutta l'attributo 'is_active', già definito nel Model Plan
                return $p->is_active; 
            });

        if (!$plan) {
            return Inertia::render('client/plan/show', ['plan' => null]);
        }

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan)
        ]);
    }

    /**
     * Storico: Mostra solo le schede passate
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $pastPlans = Plan::with('trainer')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->filter(function ($p) {
                // Si usa l'attributo del Model, se non è attiva, è passata.
                return !$p->is_active; 
            })->values();

        return Inertia::render('client/history/index', [
            'pastPlans' => $pastPlans
        ]);
    }

    /**
     * Dettaglio: Visualizza una scheda specifica dallo storico
     */
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $plan->load(['trainer', 'exercises']);

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan),
            'isHistory' => true
        ]);
    }

    /**
     * Formattazione dati per la fruizione lato React
     */
    private function formatPlanData(Plan $plan)
    {
        $structuredPlan = $plan->exercises
            ->groupBy('pivot.week_number')
            ->map(function ($weekExercises) {
                return $weekExercises->groupBy('pivot.day_of_week');
            });

        return [
            'id'           => $plan->id,
            'name'         => $plan->name,
            'trainer'      => $plan->trainer->name ?? 'STAFF TECNICO',
            'start_date'   => Carbon::parse($plan->created_at)->format('d/m/Y'),
            'total_weeks'  => $plan->num_weeks,
            'weeks'        => $structuredPlan,
        ];
    }
}