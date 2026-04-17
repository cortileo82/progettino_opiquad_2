<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = auth()->user()->load('trainer');

        // 1. Recuperiamo l'ultimo piano (attivo o no) con gli esercizi
        $myPlans = Plan::with(['trainer', 'exercises'])
                       ->where('user_id', $user->id)
                       ->latest()
                       ->get();

        // 2. Trasformiamo i dati
        $formattedPlans = $myPlans->map(function ($plan) {
            // Calcolo settimana corrente rispetto alla data di creazione
            $startDate = $plan->created_at;
            $now = Carbon::now();
            $daysPassed = $startDate->diffInDays($now);
            $currentWeek = floor($daysPassed / 7) + 1;

            // Cap (limite) al numero massimo di settimane del piano
            if ($currentWeek > $plan->num_weeks) {
                $currentWeek = $plan->num_weeks;
            }

            return [
                'id'           => $plan->id,
                'name'         => $plan->name,
                'is_active'    => $plan->is_active,
                'start_date'   => $plan->created_at->format('d/m/Y'),
                'end_date'     => $plan->end_date,
                'current_week' => $currentWeek,
                'total_weeks'  => $plan->num_weeks,
                // Raggruppiamo gli esercizi per giorno, ma FILTRATI per la settimana corrente
                'weekly_days'  => $plan->exercises
                                    ->where('pivot.week_number', $currentWeek)
                                    ->groupBy('pivot.day_of_week')
                                    ->toArray(),
                // Tutti i giorni (senza filtro settimana) per la pagina "La mia Scheda"
                'all_days'     => $plan->exercises
                                    ->groupBy('pivot.day_of_week')
                                    ->toArray(),
            ];
        });

        return Inertia::render('client/dashboard', [
            'assignedTrainer' => $user->trainer ? $user->trainer->name : 'Nessun Trainer',
            'activePlan'      => $formattedPlans->firstWhere('is_active', true),
            'pastPlans'        => $formattedPlans->where('is_active', false)->values()->all(),
        ]);
    }
}