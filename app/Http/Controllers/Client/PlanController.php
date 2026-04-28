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

        $plan = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->latest()
            ->first();

        $data = null;
        if ($plan) {
            $data = $this->formatPlanData($plan);
        }

        return Inertia::render('client/plan/show', [
            'plan' => $data
        ]);
    }

    public function history(Request $request)
    {
        $user = $request->user();

        // Recuperiamo i piani paginati
        $pastPlans = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->paginate(10);

        // Trasformiamo i dati uno per uno per strutturare weeks
        $pastPlans->getCollection()->transform(function ($plan) {
            return $this->formatPlanData($plan);
        });

        return Inertia::render('client/history/index', [
            'pastPlans' => $pastPlans
        ]);
    }

    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $plan->load(['trainer:id,name', 'exercises']);

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan),
            'isHistory' => true
        ]);
    }

    private function formatPlanData(Plan $plan): array
    {
        // Trasformiamo la lista piatta di esercizi in Settimana -> Giorno -> Esercizi
        $structuredWeeks = $plan->exercises->groupBy('pivot.week_number')->map(function ($week) {
            return $week->groupBy('pivot.day_of_week');
        });

        return [
            'id'          => $plan->id,
            'name'        => $plan->name,
            'trainer'     => [
                'name' => $plan->trainer ? $plan->trainer->name : 'Staff Tecnico'
            ],
            'created_at'  => $plan->created_at,
            'start_date'  => Carbon::parse($plan->created_at)->format('d/m/Y'),
            'total_weeks' => $plan->num_weeks,
            'num_weeks'   => $plan->num_weeks,
            'weeks'       => $structuredWeeks,
        ];
    }
}