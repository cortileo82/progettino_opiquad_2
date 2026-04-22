<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Enums\MuscleGroup;
use App\Http\Requests\ExerciseRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Exercise::class);

        $exercises = Exercise::latest()->get();
        return Inertia::render('admin/exercises/index', ['exercises' => $exercises]);
    }

    public function create()
    {
        Gate::authorize('create', Exercise::class);

        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    public function store(ExerciseRequest $request)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in ExerciseRequest

        Exercise::create($request->all());
        return redirect('/admin/exercises')->with('success', 'Esercizio creato!');
    }

    public function edit(Exercise $exercise)
    {
        Gate::authorize('update', $exercise);

        return Inertia::render('admin/exercises/edit', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::values(),
        ]);
    }

    public function update(ExerciseRequest $request, Exercise $exercise)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in ExerciseRequest

        $exercise->update($request->all());
        return redirect('/admin/exercises')->with('success', 'Esercizio aggiornato!');
    }

    public function destroy(Exercise $exercise)
    {
        // 1. Autorizzazione
        Gate::authorize('delete', $exercise);

        // 2. Pulizia delle relazioni (Previene il crash del DB)
        // Questo cancella tutte le righe dalla tabella pivot 'plan_exercises' 
        // che contengono questo specifico esercizio.
        //$exercise->plans()->detach();

        // 3. Eliminazione fisica
        $exercise->delete();

        return redirect('/admin/exercises')->with('success', 'Esercizio eliminato con successo!');
    }
}