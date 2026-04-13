<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Enums\MuscleGroup;
use App\Http\Requests\StoreExerciseRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    // Stampa lista esercizi
    public function index()
    {
        // Si usa latest() per mostrare prima i più recenti
        $exercises = Exercise::latest()->get(); 
        
        return Inertia::render('admin/exercises/index', [
            'exercises' => $exercises
        ]);
    }

    // Stampa form per la creazione di un esercizio
    public function create()
    {
        // Si passa a React i valori dell'Enum dei Muscle Groups
        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    // Salvataggio di un esercizio
    public function store(StoreExerciseRequest $request)
    {
        Exercise::create($request->validated());

        // Redirect all'index degli esercizi
        return redirect()->route('admin.exercises.index');
    }

    // Stampa form per la modifica di un esercizio
    public function edit(Exercise $exercise)    // "Exercise $exercise" comunica a Laravel di fare già la query al DB
    {
        return Inertia::render('admin/exercises/edit', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    // Aggiornamento di un esercizio
    public function update(StoreExerciseRequest $request, Exercise $exercise)   // Per avere meno codice si utilizza ancora StoreExerciseRequest
    {
        $exercise->update($request->validated());

        return redirect()->route('admin.exercises.index');
    }

    // Eliminazione di un esercizio
    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        // Si ritorna alla pagina precedente da cui si è eliminato l'esercizio 
        return redirect()->back(); 
    }
}