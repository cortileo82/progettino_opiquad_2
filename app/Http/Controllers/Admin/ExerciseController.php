<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Http\Requests\ExerciseRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    /**
     * Visualizza la lista degli esercizi.
     */
    public function index()
    {
        Gate::authorize('viewAny', Exercise::class);

        // FIX: Caricamento della relazione 'muscle_group'
        $exercises = Exercise::with('muscle_group')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/exercises/index', [
            'exercises' => $exercises
        ]);
    }

    /**
     * Mostra il form di creazione.
     */
    public function create()
    {
        Gate::authorize('create', Exercise::class);

        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::getForDropDown(),
        ]);
    }

    /**
     * Salva un nuovo esercizio.
     */
    public function store(ExerciseRequest $request)
    {
        Gate::authorize('create', Exercise::class);

        Exercise::create($request->all());
        return redirect('/admin/exercises')->with('success', 'Exercise created!');
    }

    /**
     * Mostra il form di modifica.
     */
    public function edit(Exercise $exercise)
    {
        Gate::authorize('update', $exercise);

        return Inertia::render('admin/exercises/edit', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::getForDropDown(),
        ]);
    }

    /**
     * Aggiorna l'esercizio esistente.
     */
    public function update(ExerciseRequest $request, Exercise $exercise)
    {
        Gate::authorize('update', $exercise);

        $exercise->update($request->all());

        return redirect('/admin/exercises')->with('success', 'Esercizio aggiornato con successo!');
    }

    /**
     * Rimuove l'esercizio dal database.
     */
    public function destroy(Exercise $exercise)
    {
        Gate::authorize('delete', $exercise);

        // Elimina l'esercizio (le relazioni pivot plan_exercises 
        // dovrebbero essere gestite via onDelete('cascade') nel database)
        $exercise->delete();

        return redirect('/admin/exercises')->with('success', 'Esercizio eliminato con successo!');
    }
}