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
    public function current(Request $request)
    {
        $user = $request->user();

        $plan = Plan::with(['trainer:id,name', 'exercises'])    // Eager Loading    
            ->where('user_id', $user->id)                       // Selezione delle schede di tale utente
            ->where('is_active', true)                          // Selezione delle schede di tale utente attive
            ->latest()                                          // Ordinamento per "created_at DESC", cioè dal più recente
            ->first();                                          // Si sceglie la scheda attiva più recente

        return Inertia::render('client/plan/show', [
            // Si utilizza la Resource se la scheda esiste
            'plan' => $plan ? new PlanResource($plan) : null 
        ]);
    }

    public function history(Request $request)
    {
        $user = $request->user();

        $pastPlans = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest()
            ->paginate();

        return Inertia::render('client/history/index', [
            // Funzione di Laravel: PlanResource::collection trasforma l'intera paginazione 
            // mantenendo intatti i link per la pagina 2, 3, ecc.
            'pastPlans' => PlanResource::collection($pastPlans) 
        ]);
    }

    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);
        
        $plan->load(['trainer:id,name', 'exercises']);

        return Inertia::render('client/plan/show', [
            // Si riutilizza la Resource
            'plan' => new PlanResource($plan), 
            'isHistory' => true
        ]);
    }
}