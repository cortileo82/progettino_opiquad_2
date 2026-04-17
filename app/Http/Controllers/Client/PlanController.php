<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function current(Request $request)
    {
        $user = $request->user();

        // Recuperiamo il piano attivo con tutti gli esercizi
        $plan = Plan::with(['trainer', 'exercises'])
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subWeeks(Plan::where('user_id', $user->id)->latest()->first()->num_weeks ?? 0)) // Filtro logico is_active
            ->latest()
            ->first();

        if (!$plan) {
            return Inertia::render('client/plan/show', ['plan' => null]);
        }

        // Formattiamo i dati raggruppandoli prima per SETTIMANA e poi per GIORNO
        $structuredPlan = $plan->exercises
            ->groupBy('pivot.week_number')
            ->map(function ($weekExercises) {
                return $weekExercises->groupBy('pivot.day_of_week');
            });

        return Inertia::render('client/plan/show', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'trainer' => $plan->trainer->name ?? 'N/A',
                'start_date' => $plan->created_at->format('d/m/Y'),
                'total_weeks' => $plan->num_weeks,
                'weeks' => $structuredPlan
            ]
        ]);
    }
}