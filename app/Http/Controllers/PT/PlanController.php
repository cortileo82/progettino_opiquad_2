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

class PlanController extends Controller
{
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
                    'week_number'  => $item['week_number'], // <-- Inseriamo la settimana!
                    'sets'         => $item['sets'],
                    'reps'         => $item['reps'],
                    'day_of_week'  => $item['day_of_week'],
                    'rest_time'    => $item['rest_time'] ?? null,
                ]);
            }

        });

        return redirect()->route('pt.dashboard')->with('success', 'Plan created successfully!');
    }
}
