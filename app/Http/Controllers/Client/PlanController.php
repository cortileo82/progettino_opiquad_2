<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PlanController extends Controller
{
    /**
     * Dashboard: Mostra la scheda ATTIVA (L'ultima che non è ancora scaduta)
     */
    public function current(Request $request)
    {
        $user = $request->user();
        $oggi = Carbon::now();

        // Recuperiamo tutti i piani dell'utente per filtrarli in PHP (più sicuro con SQLite)
        $allPlans = Plan::with(['trainer', 'exercises'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        // Cerchiamo la prima scheda che scade DOPO oggi
        $plan = $allPlans->first(function ($p) use ($oggi) {
            $dataScadenza = Carbon::parse($p->created_at)->addWeeks($p->num_weeks);
            return $dataScadenza->greaterThanOrEqualTo($oggi);
        });

        // Se non ci sono schede attive, non mostriamo nulla (o l'ultima scaduta, a tua scelta)
        if (!$plan) {
            return Inertia::render('client/plan/show', ['plan' => null]);
        }

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan)
        ]);
    }

    /**
     * Storico: Mostra solo le schede la cui data di scadenza è PASSATA
     */
    public function history(Request $request)
    {
        $user = $request->user();
        $oggi = Carbon::now();

        $allPlans = Plan::with('trainer')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        // Filtriamo: prendiamo solo quelle dove (creazione + settimane) < oggi
        $pastPlans = $allPlans->filter(function ($p) use ($oggi) {
            $dataScadenza = Carbon::parse($p->created_at)->addWeeks($p->num_weeks);
            return $dataScadenza->lessThan($oggi);
        })->values(); // values() resetta gli indici per React

        return Inertia::render('client/history/index', [
            'pastPlans' => $pastPlans
        ]);
    }

    /**
     * Dettaglio: Visualizza una scheda specifica
     */
    public function show(Plan $plan)
    {
        if ($plan->user_id !== Auth::id()) {
            abort(403);
        }

        $plan->load(['trainer', 'exercises']);

        return Inertia::render('client/plan/show', [
            'plan' => $this->formatPlanData($plan),
            'isHistory' => true
        ]);
    }

    /**
     * Formattazione dati: raggruppamento esercizi
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