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
    /* Visualizzazione della scheda corrente */
    public function current(Request $request)
    {
        $user = $request->user();
        $plan = Plan::with(['trainer:id,name', 'exercises'])    // Eager Loading    
            ->where('user_id', $user->id)                       // Selezione delle schede di tale utente
            ->where('is_active', true)                          // Selezione delle schede di tale utente attive
            ->latest()                                          // Ordinamento per "created_at DESC", cioè dal più recente
            ->first();                                          // Si sceglie la scheda attiva più recente
        return Inertia::render('client/plan/show', [
            /* Si utilizza la Resource se la scheda esiste */
            'plan' => $plan ? new PlanResource($plan) : null 
        ]);
    }

    /* Visualizza lo storico: solo schede pagate o tutte se l'utente è Premium */
    public function history(Request $request)
    {
        $user = $request->user();
        $query = Plan::with(['trainer:id,name', 'exercises'])
            ->where('user_id', $user->id)
            ->where('is_active', false); // Solo schede passate
        /* Se l'utente NON è premium, carichiamo solo le schede dove is_paid è 1 */
        if (!$user->is_premium) {
            $query->where('is_paid', true);
        }
        $pastPlans = $query->latest()->paginate(10); //Ritorna le schede passate paginate (per la paginazione lato frontend)
        return Inertia::render('client/history/index', [
            'pastPlans' => PlanResource::collection($pastPlans),
            'isPremium' => (bool) $user->is_premium
        ]);
    }

    /* Protezione per la singola scheda */
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);
        $user = auth()->user();
        /* Se un utente prova a digitare l'ID di una scheda non pagata (e non è premium) */
        if (!$user->is_premium && !$plan->is_paid) {
            return redirect()->route('client.history')
                ->with('error', 'Non hai i permessi per visualizzare questa scheda.');
        }
        $plan->load(['trainer:id,name', 'exercises']);
        return Inertia::render('client/plan/show', [
            'plan' => new PlanResource($plan), 
            'isHistory' => true,
            'isPremium' => (bool) $user->is_premium
        ]);
    }
}