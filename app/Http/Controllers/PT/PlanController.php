<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;      
use App\Models\Exercise; 
use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Requests\StorePlanRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    // In PlanController.php
    public function show(Plan $plan)
    {
        // Il PT stia guardando una scheda dei SUOI clienti
        if ($plan->pt_id !== auth()->id()) {
            abort(403, 'Accesso negato.');
        }

        $plan->load('exercises');

        // Inoltre carichiamo i dati base del cliente per avere il suo nome
        $client = User::find($plan->user_id);

        return Inertia::render('pt/plans/show', [
            'plan' => $plan,
            'client' => $client
        ]);
    }

    public function create(User $client) 
    {
        if($client->trainer_id !== auth()->id()) {
            abort(403, 'You do not have permission to create plans for this user');
        }

        return Inertia::render('pt/plans/create', [
            'client' => $client,
            'exercises_list' => Exercise::all() // Esercizi per il form di creazione scheda
        ]);
    }

    public function store(StorePlanRequest $request)
    {
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
        $plan->load('exercises');

        // Inoltre carichiamo i dati base del cliente per avere il suo nome
        $client = User::find($plan->user_id);

        return Inertia::render('pt/plans/edit', [
            'plan' => $plan,
            'exercises_list' => Exercise::orderBy('name')->get(),
            'client' => $client,
        ]);
    }

    public function update(StorePlanRequest $request, Plan $plan)
    {
        // 1. Autorizzazione utente per la modifica di tale specifica scheda (PT diversi potrebbero interferirsi a vicenda)
        Gate::authorize('update', $plan);

        // 2. Validazione dei dati ricevuti per la modifica della scheda
        $data = $request->validated();

        // 3. Modifica atomica della tabella "plan" e della tabella pivot "plan_exercises"
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
