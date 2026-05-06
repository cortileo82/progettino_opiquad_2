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
        // 1. Caricamento utente e trainer
        $user = $request->user()->load('trainer:id,name');

        // 2. Recupero Scheda Attiva con esercizi
        $activePlan = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->latest()
            ->first();

        // 3. Recupero Storico (DTO leggero)
        $pastPlans = Plan::with('trainer:id,name')
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->get();

        return Inertia::render('client/dashboard', [
            'assignedTrainer' => $user->trainer ? $user->trainer->name : null,
            'activePlan'      => $activePlan ? $this->formatActivePlan($activePlan) : null,
            'pastPlans'       => $pastPlans->map(fn($plan) => $this->formatPastPlan($plan)),
        ]);
    }

    /**
     * Formatta la scheda attiva includendo i permessi di pagamento
     */
    private function formatActivePlan(Plan $plan): array
    {
        $daysPassed = $plan->created_at->diffInDays(now());
        $currentWeek = min((int) floor($daysPassed / 7) + 1, $plan->num_weeks);

        return [
            'id'           => $plan->id,
            'name'         => $plan->name,
            'is_active'    => (bool) $plan->is_active,
            
            // CAMPO CRITICO AGGIUNTO: permette al frontend di togliere il blur
            'is_paid'      => (bool) $plan->is_paid, 
            
            'start_date'   => $plan->created_at->format('d/m/Y'),
            'end_date'     => $plan->end_date,
            'current_week' => $currentWeek,
            'total_weeks'  => $plan->num_weeks,
            
            // Esercizi filtrati per la settimana corrente
            'weekly_days'  => $plan->exercises
                                ->where('pivot.week_number', $currentWeek)
                                ->groupBy('pivot.day_of_week')
                                ->toArray(),
            
            'all_days'     => $plan->exercises
                                ->groupBy('pivot.day_of_week')
                                ->toArray(),
        ];
    }

    /**
     * DTO leggero per lo storico
     */
    private function formatPastPlan(Plan $plan): array
    {
        return [
            'id'           => $plan->id,
            'name'         => $plan->name,
            'is_active'    => (bool) $plan->is_active,
            'is_paid'      => (bool) $plan->is_paid, // Aggiunto anche qui per coerenza
            'start_date'   => $plan->created_at->format('d/m/Y'),
            'end_date'     => $plan->end_date,
            'total_weeks'  => $plan->num_weeks,
        ];
    }
}