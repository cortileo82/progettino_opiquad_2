<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MuscleGroup;
use App\Http\Requests\MuscleGroupRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MuscleGroupController extends Controller
{
    public function index(Request $request) // 1. Aggiungi il parametro Request
    {
        Gate::authorize('viewAny', MuscleGroup::class);

        $muscleGroups = MuscleGroup::query()
            // 2. Aggiungi il filtro per la ricerca
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString(); // Mantiene il parametro search nei link della paginazione

        return Inertia::render('admin/musclegroups/index', [
            'muscleGroups' => $muscleGroups,
            'filters' => $request->only(['search']), // 3. Passa i filtri al frontend
        ]);
    }

    public function create()
    {
        Gate::authorize('create', MuscleGroup::class);

        return Inertia::render('admin/musclegroups/create');
    }

    public function store(MuscleGroupRequest $request)
    {
        Gate::authorize('create', MuscleGroup::class);

        MuscleGroup::create($request->validated());
        return redirect('/admin/muscle-groups')->with('success', 'Muscle group created successfully!');
    }

    public function edit(MuscleGroup $muscleGroup)
    {
        Gate::authorize('update', $muscleGroup);

        return Inertia::render('admin/musclegroups/create', ['muscleGroup' => $muscleGroup,]);
    }

    public function update(MuscleGroupRequest $request, MuscleGroup $muscleGroup)
    {
        Gate::authorize('update', $muscleGroup);

        $muscleGroup->update($request->validated());
        return redirect('/admin/muscle-groups')->with('success', 'Muscle group updated successfully!');
    }

    public function destroy(MuscleGroup $muscleGroup)
    {
        Gate::authorize('delete', $muscleGroup);

        // PROTEZIONE INTEGRITÀ REFERENZIALE
        if ($muscleGroup->exercises()->exists()) {
            return redirect('/admin/muscle-groups')->with('error', 'Non è possibile eliminare il gruppo muscolare perchè sono asscoiati esercizi.');
        }

        $muscleGroup->delete();

        return redirect('/admin/muscle-groups')->with('success', 'Muscle group deleted successfully!');
    }
}