<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Enums\MuscleGroup; 
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

    // Mostra il form di modifica
    public function edit(Exercise $exercise)
    {
        return Inertia::render('admin/exercises/edit', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    // Aggiorna l'esercizio esistente
    public function update(Request $request, Exercise $exercise)
    {
        // Validazione manuale qui per evitare conflitti con StoreExerciseRequest
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'muscle_group' => 'nullable|string', 
        ]);

        // Esegui l'aggiornamento
        $exercise->update($validated);

        // Redirect usando il percorso statico (più sicuro nel tuo caso)
        return redirect('/admin/exercises')->with('success', 'Esercizio aggiornato!');
    }

    // Elimina l'esercizio
    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return redirect('/admin/exercises')->with('success', 'Esercizio eliminato!');
    }

    // Ho lasciato i metodi store e create se ti servono in futuro, 
    // ma li ho puliti per coerenza
    public function create()
    {
        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'muscle_group' => 'required|string',
        ]);

        Exercise::create($validated);

        return redirect('/admin/exercises');
    }
    // Aggiungi questo metodo all'interno della classe ExerciseController

   public function catalog()
    {
        $exercises = Exercise::orderBy('muscle_group')
            ->orderBy('name')
            ->get();

        // Modifica il percorso qui:
        return Inertia::render('pt/catalog', [
            'exercises' => $exercises
        ]);
    }
}