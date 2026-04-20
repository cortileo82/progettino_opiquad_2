<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;      
use App\Models\Exercise; 
use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdatePlanRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        // Si caricano i dati
        $plan->load('exercises');
        $client = User::find($plan->user_id);

        return Inertia::render('pt/plans/show', [
            'plan' => $plan,
            'client' => $client
        ]);
    }

    public function create(User $client) 
    {
        Gate::authorize('create', [Plan::class, $client]);

        return Inertia::render('pt/plans/create', [
            'client' => $client,
            'exercises_list' => Exercise::all() // Esercizi per il form di creazione scheda
        ]);
    }

    public function store(StorePlanRequest $request)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in StorePlanRequest

        // Validazione della richiesta
        $data = $request->validated();

        // Salvataggio atomico dei dati nel DB
        DB::transaction(function () use ($data) {

            // 1. Creazione entità "Plan" (Scheda)
            $plan = Plan::create([
                'user_id' => $data['user_id'],
                'pt_id' => auth()->id(),
                'name' => $data['name'],
                'num_weeks' => $data['num_weeks'],
            ]);

            // 2. Si trasformano i dati e li si accodano
            foreach ($data['exercises'] as $item) {
                $plan->exercises()->attach($item['exercise_id'], [
                    'week_number'  => $item['week_number'], 
                    'sets'         => $item['sets'],
                    'reps'         => $item['reps'],
                    'day_of_week'  => $item['day_of_week'],
                    'rest_time'    => $item['rest_time'] ?? null,
                ]);
            }

        });

        return redirect()->route('pt.dashboard')->with('success', 'Plan created successfully!');
    }

    public function edit(Plan $plan)
    {
        Gate::authorize('update', $plan);

        // Si dice a Laravel di caricare gli esercizi collegati a tale scheda per idratare il frontend
        // e il cliente di tale scheda per avere il suo nome
        $plan->load(['exercises', 'client']);

        return Inertia::render('pt/plans/edit', [
            'plan' => $plan,
            'exercises_list' => Exercise::orderBy('name')->get(),
            'client' => $plan->client,
        ]);
    }

    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in UpdatePlanRequest

        // 1. Validazione dei dati ricevuti per la modifica della scheda
        $data = $request->validated();

        // 2. Modifica atomica della tabella "plan" e della tabella pivot "plan_exercises"
        DB::transaction(function () use ($plan, $data) {
            // A. Aggiornamento tabella "plan"
            $plan->update([
                'name' => $data['name'],
                'num_weeks' => $data['num_weeks'],
            ]);

            // B. Si dissociano le righe "exercise" associati a quella scheda
            $plan->exercises()->detach();

            // C. Si associano i nuovi esercizi ricevuti dalla richiesta
            foreach ($data['exercises'] as $item) {
                $plan->exercises()->attach($item['exercise_id'], [
                    'week_number'  => $item['week_number'],
                    'day_of_week'  => $item['day_of_week'],
                    'sets'         => $item['sets'],
                    'reps'         => $item['reps'],
                    'rest_time'    => $item['rest_time'] ?? null,
                ]);
            }
        });

        // 4. Si riporta il PT alla dashboard
        return redirect()->route('pt.dashboard')->with('success', 'Plan updated successfully!');
    }

    public function delete(Plan $plan)
    {
        Gate::authorize('delete', $plan);

        $plan->delete();

        return redirect()->back();
    }
}
