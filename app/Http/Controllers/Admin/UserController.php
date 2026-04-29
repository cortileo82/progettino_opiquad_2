<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request; // Importante
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request) // Aggiunta Request
    {
        Gate::authorize('viewAny', User::class);
        
        $users = User::with(['trainer', 'roles'])
            // Logica di ricerca per Nome o Email
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString(); // Mantiene i filtri tra le pagine

        $personalTrainers = User::role(User::ROLE_PT)->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search']), // Passa i filtri al frontend
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

        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($request['password']),
            'trainer_id' => $validated['trainer_id'] ?? null,
        ]);

        $user->assignRole($validated['role']);

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