<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
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
        
        // Utilizzo della query scope di Spatie per prendere solo i PT
        $personalTrainers = User::role('pt')->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('admin/accounts/index', [
            'users' => $users,
            'personalTrainers' => $personalTrainers
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);
        
        return Inertia::render('admin/accounts/create', [
            // 1. Tutti i PT per il secondo menu a tendina
            'personalTrainers' => User::role(User::ROLE_PT)->orderBy('name')->get(['id', 'name']),
            
            // 2. TUTTI i ruoli presenti nel DB (Core + Custom come Nutrizionista)
            'availableRoles' => Role::orderBy('name')->get(['name']), 
            
            // 3. Passiamo la costante "client" per la logica UI di React
            'clientRoleSlug' => User::ROLE_CLIENT 
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);
        
        // I dati sono già stati filtrati dalla Request. 
        // Se il ruolo non era 'client', 'trainer_id' è stato rimosso in automatico.
        $validated = $request->validated();

        // 1. Creazione record DB 
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($request['password']),
            'trainer_id' => $validated['trainer_id'] ?? null,
        ]);

        // 2. Assegnazione ruolo nel DB di Spatie
        $user->assignRole($request->role);

        return Inertia::render('admin/accounts/success');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);
        
        $validated = $request->validated();

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Se è un cliente, si aggiorna col valore validato. 
        // Altrimenti, se non lo è, la request ha rimosso il campo e lo si mette a null a prescindere.
        $user->trainer_id = array_key_exists('trainer_id', $validated) ? $validated['trainer_id'] : null;
        
        $user->save();

        // Sincronizza il ruolo (cancella il vecchio, imposta il nuovo)
        if (isset($validated['role'])) {
            $user->syncRoles($validated['role']);
        }

        return redirect('/admin/accounts')->with('success', 'Account aggiornato con successo!');
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();
        
        return redirect('/admin/accounts')->with('success', 'Utente rimosso.');
    }
}