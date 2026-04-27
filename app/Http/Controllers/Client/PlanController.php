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
    public function current(Request $request)
    {
        $user = $request->user();

        // Si filtra in SQL usando where('is_active', true)
        // Questo è immensamente più veloce e scalabile del filter() in RAM.
        $plan = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->latest()
            ->first();

        return Inertia::render('client/plan/show', [
            'plan' => $plan ? $this->formatPlanData($plan) : null
        ]);
    }

    public function history(Request $request)
    {
        $user = $request->user();

        // Si filtra lo storico via SQL. 
        // Estraiamo solo i campi necessari del trainer.
        $pastPlans = Plan::with('trainer:id,name')
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->get();

        return Inertia::render('client/history/index', [
            'pastPlans' => $pastPlans
        ]);
    }

    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        // Ottimizziamo il load estraendo solo id e name del trainer
        $plan->load(['trainer:id,name', 'exercises']);

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan),
            'isHistory' => true
        ]);
    }

    private function formatPlanData(Plan $plan): array
    {
        $structuredPlan = $plan->exercises->groupBy('pivot.week_number')->map(function ($weekExercises) {
            return $weekExercises->groupBy('pivot.day_of_week');
        });

        return [
            'id'          => $plan->id,
            'name'        => $plan->name,
            'trainer'     => $plan->trainer ? $plan->trainer->name : null,      // Il frontend gestisce per null il fallback coerente.
            'start_date'  => Carbon::parse($plan->created_at)->format('d/m/Y'),
            'total_weeks' => $plan->num_weeks,
            'weeks'       => $structuredPlan,
        ];
    }
}
