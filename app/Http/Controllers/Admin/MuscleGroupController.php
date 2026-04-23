<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MuscleGroup;
use App\Http\Requests\MuscleGroupRequest;
use Inertia\Inertia;

class MuscleGroupController extends Controller
{
    public function index()
    {
        $muscleGroups = MuscleGroup::orderBy('name')->get();

        return Inertia::render('admin/musclegroups/index', ['muscleGroups' => $muscleGroups,]);
    }

    public function create()
    {
        return Inertia::render('admin/musclegroups/create');
    }

    public function store(MuscleGroupRequest $request)
    {
        MuscleGroup::create($request->validated());
        return redirect('/admin/muscle-groups')->with('success', 'Muscle group created successfully!');
    }

    public function edit(MuscleGroup $muscleGroup)
    {
        return Inertia::render('admin/musclegroups/edit', ['muscleGroup' => $muscleGroup,]);
    }

    public function update(MuscleGroupRequest $request, MuscleGroup $muscleGroup)
    {
        $muscleGroup->update($request->validated());
        return redirect('/admin/muscle-groups')->with('success', 'Muscle group updated successfully!');
    }

    public function destroy(MuscleGroup $muscleGroup)
    {
        // PROTEZIONE INTEGRITÀ REFERENZIALE
        if ($muscleGroup->exercises()->exists()) {
            return redirect('/admin/muscle-groups')->with('error', 'Non è possibile eliminare il gruppo muscolare perchè sono asscoiati esercizi.');
        }

        $muscleGroup->delete();

        return redirect('/admin/muscle-groups')->with('success', 'Muscle group deleted successfully!');
    }
}