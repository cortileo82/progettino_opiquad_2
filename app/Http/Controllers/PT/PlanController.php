<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Requests\PlanRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        // Si evitiamo query extra. 
        // Si caricano sia gli esercizi che il cliente associato alla scheda in un solo colpo tramite l'Eager Loading.
        $plan->load(['exercises', 'client']);

        return Inertia::render('pt/plans/show', [
            'plan' => $plan,
            'client' => $plan->client,
        ]);
    }

    public function create(User $client)
    {
        Gate::authorize('create', [Plan::class, $client]);

        return Inertia::render('pt/plans/create', [
            'client' => $client,
            // Piuttosto che all(), si pescano solo id e nome per alleggerire il payload JSON a React.
            'exercises_list' => Exercise::select('id', 'name')->orderBy('name')->get()
        ]);
    }

    public function store(PlanRequest $request)
    {
        $data = $request->validated();

        Gate::authorize('create', [Plan::class, User::findOrFail($data['user_id'])]);

        // Transazione: se fallisce l'assegnazione esercizi, la scheda non viene creata e la vecchia non viene disattivata.
        DB::transaction(function () use ($data, $request) {
            
            // 1. Si spengono le vecchie schede attive del cliente
            Plan::where('user_id', $data['user_id'])
                ->where('is_active', true)
                ->update(['is_active' => false]);

            // 2. Si crea la nuova scheda imponendola come attiva
            $plan = Plan::create([
                'user_id'   => $data['user_id'],
                'pt_id'     => $request->user()->id,
                'name'      => $data['name'],
                'num_weeks' => $data['num_weeks'],
                'is_active' => true,
            ]);

            // 3. Inserimento pivot (Essendo in una transazione, il loop è ultra-veloce)
            //    Si usa attach() nel loop perché un utente potrebbe avere lo stesso esercizio due volte in giorni diversi, 
            //    e dunque le chiavi array PHP sovrascriverebbero i dati.
            foreach ($data['exercises'] as $item) {
                $plan->exercises()->attach($item['exercise_id'], [
                    'week_number' => $item['week_number'],
                    'sets'        => $item['sets'],
                    'reps'        => $item['reps'],
                    'day_of_week' => $item['day_of_week'],
                    'rest_time'   => $item['rest_time'] ?? null,
                    'weight_kg'   => $item['weight_kg'] ?? null,
                ]);
            }
        });

        return redirect()->route('pt.clients.manage-clients')
            ->with('success', "Scheda '{$data['name']}' creata e attivata con successo!");
    }

    public function edit(Plan $plan)
    {
        Gate::authorize('update', $plan);
        
        $plan->load(['exercises', 'client']);

        return Inertia::render('pt/plans/create', [
            'plan' => $plan,
            'client' => $plan->client,
            // si pescano solo id e nome per alleggerire il payload JSON a React.
            'exercises_list' => Exercise::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function update(PlanRequest $request, Plan $plan)
    {
        Gate::authorize('update', $plan);

        $data = $request->validated();

        DB::transaction(function () use ($plan, $data) {
            
            // 1. Si aggiornano i dati base (is_active non viene toccato, rimane com'era)
            $plan->update([
                'name'      => $data['name'],
                'num_weeks' => $data['num_weeks'],
            ]);

            // 2. Si pulisce il vecchio protocollo di esercizi
            $plan->exercises()->detach();

            // Si inserisce il protocollo aggiornato
            foreach ($data['exercises'] as $item) {
                $plan->exercises()->attach($item['exercise_id'], [
                    'week_number' => $item['week_number'],
                    'day_of_week' => $item['day_of_week'],
                    'sets'        => $item['sets'],
                    'reps'        => $item['reps'],
                    'rest_time'   => $item['rest_time'] ?? null,
                    'weight_kg'   => $item['weight_kg'] ?? null,
                ]);
            }
        });

        return redirect()->route('pt.clients.plans', $plan->user_id)
            ->with('success', "Scheda aggiornata correttamente!");
    }

    public function delete(Plan $plan)
    {
        Gate::authorize('delete', $plan);
        
        $plan->delete();

        return redirect()->back()
            ->with('success', 'Scheda eliminata definitivamente.');
    }
}