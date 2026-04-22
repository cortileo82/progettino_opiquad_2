<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Http\Requests\StoreExerciseRequest;
use App\Http\Requests\UpdateExerciseRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Exercise::class);

        $exercises = Exercise::with('muscleGroup')->orderBy('name')->get();

        return Inertia::render('admin/exercises/index', [
            'exercises' => $exercises
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Exercise::class);

        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::getForDropDown(),
        ]);
    }

    public function store(StoreExerciseRequest $request)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in StoreExerciseRequest

        Exercise::create($request->validated());
        return redirect('/admin/exercises')->with('success', 'Exercise created successfully!');
    }

    public function edit(Exercise $exercise)
    {
        Gate::authorize('update', $exercise);

        return Inertia::render('admin/exercises/edit', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::getForDropDown(),
        ]);
    }

    public function update(UpdateExerciseRequest $request, Exercise $exercise)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in UpdateExerciseRequest

        $exercise->update($request->validated());
        return redirect('/admin/exercises')->with('success', 'Exercise updated successfully!');
    }

    public function destroy(Exercise $exercise)
    {
        // 1. Autorizzazione
        Gate::authorize('delete', $exercise);

        // 2. Pulizia delle relazioni (Previene il crash del DB)
        // Questo cancella tutte le righe dalla tabella pivot 'plan_exercises' 
        // che contengono questo specifico esercizio.
        $exercise->plans()->detach();

        // 3. Eliminazione fisica
        $exercise->delete();

        return redirect('/admin/exercises')->with('success', 'Exercise deleted successfully!');
    }
}