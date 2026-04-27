<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', User::class);
        
        $users = User::with(['trainer', 'roles'])->latest()->get(); 
        $personalTrainers = User::role(User::ROLE_PT)->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('admin/users/index', [
            'users' => $users,
            'personalTrainers' => $personalTrainers,
            'availableRoles' => Role::orderBy('name')->get(['name']),
            'clientRoleSlug' => User::ROLE_CLIENT,
            'adminRoleSlug' => User::ROLE_ADMIN,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);
        
        return Inertia::render('admin/users/create', [
            'personalTrainers' => User::role(User::ROLE_PT)->orderBy('name')->get(['id', 'name']),
            'availableRoles' => Role::orderBy('name')->get(['name']), 
            'clientRoleSlug' => User::ROLE_CLIENT 
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);
        
        $validated = $request->validated();

        // 1. Creazione record DB 
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($request['password']),
            'trainer_id' => $validated['trainer_id'] ?? null,
        ]);

        // 2. Assegnazione ruolo nel DB di Spatie
        $user->assignRole($validated['role']);

        // --- MODIFICA QUI: Reindirizzamento corretto ---
        return redirect()->route('admin.users.index')
            ->with('success', 'Utente creato con successo!');
    }

    public function edit(User $user)
    {
        Gate::authorize('update', $user);

        $user->load('roles');

        $personalTrainers = User::role(User::ROLE_PT)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $availableRoles = Role::select('name')->get();

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'personalTrainers' => $personalTrainers,
            'availableRoles' => $availableRoles,
            'clientRoleSlug' => User::ROLE_CLIENT, 
            'adminRoleSlug'  => User::ROLE_ADMIN,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);
        
        $validated = $request->validated();

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->trainer_id = array_key_exists('trainer_id', $validated) ? $validated['trainer_id'] : null;
        
        $user->save();

        if (isset($validated['role'])) {
            $user->syncRoles($validated['role']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Utente aggiornato con successo!');
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();
        
        return redirect()->route('admin.users.index')
            ->with('success', 'Utente rimosso.');
    }
}