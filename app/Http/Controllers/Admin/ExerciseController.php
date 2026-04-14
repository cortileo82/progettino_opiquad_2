<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
// Assicurati che questo Enum esista, altrimenti darà errore. 
// Se non lo hai ancora creato, lo commenteremo nel prossimo passaggio.
use App\Enums\MuscleGroup; 
use App\Http\Requests\StoreExerciseRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    // Visualizza la lista degli esercizi
    public function index()
    {
        $exercises = Exercise::latest()->get(); 
        
        return Inertia::render('admin/exercises/index', [
            'exercises' => $exercises
        ]);
    }

    // Mostra il form di creazione
    public function create()
    {
        // Recuperiamo i valori dall'Enum. 
        // NOTA: Se MuscleGroup::values() fallisce, assicurati che l'Enum sia corretto.
        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    // Salva un nuovo esercizio
    public function store(StoreExerciseRequest $request)
    {
        Exercise::create($request->validated());

        // Redirect esplicito all'index
        return redirect()->route('admin.exercises.index');
    }

    // Mostra il form di modifica
    public function edit(Exercise $exercise)
    {
        return Inertia::render('admin/exercises/edit', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    // Aggiorna l'esercizio esistente
    public function update(StoreExerciseRequest $request, Exercise $exercise)
    {
        $exercise->update($request->validated());

        return redirect()->route('admin.exercises.index');
    }

    // Elimina l'esercizio
    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return redirect()->back(); 
    }
}