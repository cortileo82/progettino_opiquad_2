<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\PlanResource; 

class PlanController extends Controller
{
    /**
     * Visualizza la scheda attualmente attiva (Dashboard/Current Plan)
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
            // PlanResource si occuperà di includere 'is_paid' nel JSON
            'plan' => $plan ? new PlanResource($plan) : null,
            // Passiamo un flag esplicito per comodità, anche se auth è già globale
            'isPremium' => (bool) $user->is_premium 
        ]);
    }

    /**
     * Visualizza lo storico delle schede passate
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $pastPlans = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->paginate(10); // Specificato un limite per pagina

        return Inertia::render('client/history/index', [
            'pastPlans' => PlanResource::collection($pastPlans),
            'isPremium' => (bool) $user->is_premium
        ]);
    }

    /**
     * Visualizza una singola scheda specifica (dallo storico o tramite link)
     */
    public function show(Plan $plan)
    {
        // Il Gate controlla che la scheda appartenga all'utente
        Gate::authorize('view', $plan);
        
        $plan->load(['trainer:id,name', 'exercises']);

        return Inertia::render('client/plan/show', [
            'plan' => new PlanResource($plan), 
            'isHistory' => true,
            'isPremium' => (bool) auth()->user()->is_premium
        ]);
    }
}