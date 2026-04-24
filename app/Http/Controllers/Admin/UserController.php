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
        $personalTrainers = User::role(User::ROLE_PT)->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('admin/users/index', [
            'users' => $users,
            'personalTrainers' => $personalTrainers,
            'availableRoles' => \Spatie\Permission\Models\Role::orderBy('name')->get(['name']),
            'clientRoleSlug' => User::ROLE_CLIENT,
            'adminRoleSlug' => User::ROLE_ADMIN,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);
        
        return Inertia::render('admin/users/create', [
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

        return Inertia::render('admin/users/success');
    }

    public function edit(User $user)
    {
        Gate::authorize('update', $user);

        // Architettura Spatie: si caricano esplicitamente i ruoli dell'utente.
        // Necessario affinché React possa fare `user.roles?.[0]?.name`
        $user->load('roles');

        // 3. Dati per le Select del form in caso di client
        // Di conseguenza si pescano gli utenti che hanno il ruolo di Personal Trainer
        $personalTrainers = clone User::role(User::ROLE_PT)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Si pescano tutti i ruoli disponibili nel database
        $availableRoles = \Spatie\Permission\Models\Role::select('name')->get();

        // 4. Invio dei dati al Frontend
        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'personalTrainers' => $personalTrainers,
            'availableRoles' => $availableRoles,
            
            // Passiamo le costanti per evitare stringhe hardcodate nel frontend
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

        // Se è un cliente, si aggiorna col valore validato. 
        // Altrimenti, se non lo è, la request ha rimosso il campo e lo si mette a null a prescindere.
        $user->trainer_id = array_key_exists('trainer_id', $validated) ? $validated['trainer_id'] : null;
        
        $user->save();

        // Sincronizza il ruolo (cancella il vecchio, imposta il nuovo)
        if (isset($validated['role'])) {
            $user->syncRoles($validated['role']);
        }

        return redirect('/admin/users')->with('success', 'Utente aggiornato con successo!');
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();
        
        return redirect('/admin/users')->with('success', 'Utente rimosso.');
    }
}