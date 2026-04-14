<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PlanController extends Controller
{
    /**
     * Mostra il form di creazione scheda per un cliente specifico.
     */
    public function create(User $client) 
    {
        // Verifica che il cliente sia effettivamente associato al PT autenticato
        if ($client->trainer_id !== auth()->id()) {
            abort(403, 'Non hai i permessi per creare schede per questo utente.');
        }

        return Inertia::render('pt/plans/create', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
            ],
            'exercises_list' => Exercise::all(['id', 'name']) 
        ]);
    }

    /**
     * Salva la nuova scheda nel database.
     */
    public function store(Request $request)
    {
        // 1. Validazione della richiesta
        $validated = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'name'      => 'required|string|max:255',
            'num_weeks' => 'required|integer|min:1',
            'exercises' => 'required|array|min:1',
            'exercises.*.exercise_id' => 'required|exists:exercises,id',
            'exercises.*.day_of_week' => 'required|string',
            'exercises.*.sets'        => 'required|integer',
            'exercises.*.reps'        => 'required|string',
            'exercises.*.rest_time'   => 'nullable|string',
        ]);

        // 2. Salvataggio atomico dei dati
        DB::transaction(function () use ($validated) {

            // Creazione della testata della scheda (Plan)
            $plan = Plan::create([
                'user_id'   => $validated['user_id'],
                'pt_id'     => auth()->id(),
                'name'      => $validated['name'],
                'num_weeks' => $validated['num_weeks'],
            ]);

            // Ciclo sugli esercizi per popolare la tabella pivot plan_exercises
            foreach ($validated['exercises'] as $item) {
                // Usiamo attach invece di sync per permettere lo stesso esercizio in giorni diversi
                $plan->exercises()->attach($item['exercise_id'], [
                    'sets'        => $item['sets'],
                    'reps'        => $item['reps'],
                    'day_of_week' => $item['day_of_week'],
                    'rest_time'   => $item['rest_time'] ?? null,
                ]);
            }
        });

        return redirect()->route('pt.dashboard')->with('success', 'Scheda creata con successo!');
    }
}