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
        
        // 1. Costruiamo la query di base (Eager Loading dinamico)
        $query = Plan::with(['trainer:id,name'])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->latest();

        // 2. Se l'utente è PRO, uniamo subito gli esercizi alla query (Mimiamo il codice originale)
        if ($user->is_premium) {
            $query->with('exercises');
        }

        $plan = $query->first();

        // 3. Se NON è premium, ma la scheda singola è pagata, la carichiamo ora (Lazy Loading sicuro)
        if ($plan && !$user->is_premium && $plan->is_paid) {
            $plan->load('exercises');
        }

        return Inertia::render('client/plan/show', [
            'plan' => $plan ? new PlanResource($plan) : null
        ]);
    }

    public function history(Request $request)
    {
        $user = $request->user();

        // 1. Query base per la lista dello storico
        $query = Plan::with(['trainer:id,name'])
            ->where('user_id', $user->id)
            ->where('is_active', false)
            ->latest();

        // 2. Se l'utente è PRO, carichiamo TUTTO subito (Eager Loading ottimizzato)
        // In questo modo riceverà la proprietà "weeks" e il frontend gli permetterà l'espansione
        if ($user->is_premium) {
            $query->with('exercises');
        }

        $pastPlans = $query->paginate(10);

        // 3. Se l'utente NON è PRO, dobbiamo controllare scheda per scheda.
        // Lazy-loading condizionale: carichiamo gli esercizi SOLO per le vecchie schede che aveva pagato.
        if (!$user->is_premium) {
            $pastPlans->getCollection()->transform(function ($plan) {
                if ($plan->is_paid) {
                    $plan->load('exercises');
                }
                return $plan;
            });
        }

        return Inertia::render('client/history/index', [
            'pastPlans' => PlanResource::collection($pastPlans),
            'isPremium' => (bool) $user->is_premium
        ]);
    }

    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);
        $user = auth()->user();

        // ARCHITETTURA: Definiamo un array di relazioni dinamico per fare un singolo "load"
        $relations = ['trainer:id,name'];

        // Se l'utente ha diritto, accodiamo gli esercizi all'array
        if ($user->is_premium || $plan->is_paid) {
            $relations[] = 'exercises';
        }

        // Unica chiamata al DB: risolve i problemi di serializzazione delle Resource
        $plan->load($relations);

        return Inertia::render('client/plan/show', [
            'plan' => new PlanResource($plan),
            'isHistory' => true
        ]);
    }
}