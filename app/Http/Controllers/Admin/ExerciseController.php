<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use App\Http\Requests\ExerciseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Exercise::class);

        $exercises = Exercise::with('muscle_group')
            // Aggiungiamo la logica di filtro per la ricerca
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhereHas('muscle_group', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/exercises/index', [
            'exercises' => $exercises,
            // Importante: passiamo i filtri attuali al frontend
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Exercise::class);

        return Inertia::render('admin/exercises/create', [
            'muscleGroups' => MuscleGroup::getForDropDown(),
        ]);
    }

    public function store(ExerciseRequest $request)
    {
        Gate::authorize('create', Exercise::class);

        Exercise::create($request->all());
        return redirect('/admin/exercises')->with('success', 'Exercise created!');
    }

    public function edit(Exercise $exercise)
    {
        Gate::authorize('update', $exercise);

        return Inertia::render('admin/exercises/create', [
            'exercise' => $exercise,
            'muscleGroups' => MuscleGroup::getForDropDown(),
        ]);
    }

    public function update(ExerciseRequest $request, Exercise $exercise)
    {
        Gate::authorize('update', $exercise);

        $exercise->update($request->all());

        return redirect('/admin/exercises')->with('success', 'Esercizio aggiornato con successo!');
    }

    public function destroy(Exercise $exercise)
    {
        Gate::authorize('delete', $exercise);

        // Elimina l'esercizio (le relazioni pivot plan_exercises 
        // sono gestite via onDelete('cascade') nel DB)
        $exercise->delete();

        return redirect('/admin/exercises')->with('success', 'Esercizio eliminato con successo!');
    }
}