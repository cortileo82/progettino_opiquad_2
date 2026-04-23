<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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
        
        // Utilizzo query scope di Spatie per prendere solo i PT
        $personalTrainers = User::role('pt')->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('admin/accounts/index', [
            'users' => $users,
            'personalTrainers' => $personalTrainers
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);
        $personalTrainers = User::role('pt')->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('admin/accounts/create', [
            'personalTrainers' => $personalTrainers
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);
        
        $validated = $request->validated();
        $trainerId = null;
        
        if ($request->role === 'client' && $request->pt_id !== 'none') {
            $trainerId = $request->pt_id;
        }

        // 1. Creazione record DB (SENZA il campo role)
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($request['password']),
            'trainer_id' => $trainerId,
        ]);

        // 2. Assegnazione ruolo nel DB di Spatie
        $user->assignRole($request->role);

        return Inertia::render('admin/accounts/success');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);
        
        $validated = $request->validated();

        if ($request->role === 'client') {
            $selectedTrainer = $request->input('trainer_id');
            $user->trainer_id = ($selectedTrainer === 'none' || empty($selectedTrainer)) ? null : $selectedTrainer;
        } else {
            $user->trainer_id = null;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        // Rimosso l'aggiornamento della password hardcodato per sicurezza se non viene cambiata
        
        $user->save();

        // Sincronizza il ruolo (cancella il vecchio, imposta il nuovo)
        if ($request->has('role')) {
            $user->syncRoles($request->role);
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