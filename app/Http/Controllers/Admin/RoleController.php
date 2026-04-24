<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\RoleRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index() {
        Gate::authorize('viewAny', Role::class);

        // Si usa "with('permissions')" per fare Eager Loading 
        // (il DB fa 2 query in totale, a prescindere che vi siano 3 o 300 ruoli). 
        // Se non lo si mettesse, React farebbe una query al DB per ogni ruolo 
        // nel tentativo di leggerne i permessi associati, uccidendo il server.
        $roles = Role::with('permissions')->get();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
        ]);
    }

    public function create() {
        Gate::authorize('create', Role::class);

        return Inertia::render('admin/roles/create', [
            'permissions' => Permission::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(RoleRequest $request) {
        Gate::authorize('create', Role::class);
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            // 1. Crea il ruolo
            $role = Role::create(['name' => $validated['name']]);
            
            // 2. Sincronizza i permessi (se non ci sono, passa un array vuoto per sicurezza)
            $role->syncPermissions($validated['permissions'] ?? []);
        });
        return redirect('/admin/roles')->with('success', 'Role created successfully!');
    }

    public function edit(Role $role) {
        Gate::authorize('update', $role);

        // Si caricano il ruolo con i suoi permessi attuali per idratare il form
        $role->load('permissions');

        return Inertia::render('admin/roles/create', [
            'role' => $role,
            'permissions' => Permission::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(RoleRequest $request, Role $role) {
        Gate::authorize('update', $role);
        $validated = $request->validated();

        $role->update(['name' => $validated['name']]);
        
        // Sincronizza: aggiunge i nuovi, rimuove quelli non più spuntati
        $role->syncPermissions($validated['permissions'] ?? []);
        
        return redirect('/admin/roles')->with('success', 'Role updated successfully!');
    }

    public function destroy(Role $role) {
        Gate::authorize('delete', $role);
        $role->delete();
        return redirect('/admin/roles')->with('success', 'Role deleted successfully!');
    }
}
