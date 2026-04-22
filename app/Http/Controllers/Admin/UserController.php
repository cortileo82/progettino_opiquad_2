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
    /**
     * Visualizza la lista di tutti gli utenti.
     */
    public function index()
    {
        Gate::authorize('viewAny', User::class);

        // Carichiamo gli utenti con il loro trainer (Eager Loading)
        $users = User::with('trainer')->latest()->get();
        
        // Recuperiamo i PT per il dropdown della modale di modifica
        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/index', [
            'users' => $users,
            'personalTrainers' => $personalTrainers
        ]);
    }

    /**
     * Mostra il form per creare un nuovo utente.
     */
    public function create()
    {
        Gate::authorize('create', User::class);

        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/create', [
            'personalTrainers' => $personalTrainers
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in StoreUserRequest

        $validated = $request->validated();

        $trainerId = null;
        if ($validated['role'] === \App\Enums\Role::CLIENT->value && $request->pt_id !== 'none') {
            $trainerId = $request->pt_id;
        }

        User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($request['password']),
            'role' => $validated['role'],
            'trainer_id' => $trainerId,
        ]);

        return Inertia::render('admin/accounts/success');
    }

    /**
     * Il metodo edit non è implementato in quanto il form di modifica di un utente appare
     * attraverso un popup e non una pagina dedicata.
     */

    public function update(UpdateUserRequest $request, User $user)
    {
        // Non serve l'autorizzazione da parte del Gate, in quanto la richiesta viene già autorizzata in UpdateUserRequest

        $validated = $request;

        /*if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }*/

       if ($validated['role'] === \App\Enums\Role::CLIENT->value) {
            $selectedTrainer = $request->input('trainer_id');

            if ($selectedTrainer === 'none' || empty($selectedTrainer)) {
                // Se seleziona 'libero', puliamo il campo nel database
                $user->trainer_id = null;
            } else {
                // Se seleziona un ID, lo assegniamo
                $user->trainer_id = $selectedTrainer;
            }
        } else {
        // Se l'utente non è un cliente, forziamo il trainer a null
        $user->trainer_id = null;
    }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        //$user->trainer_id = $trainerId;
        $user->save();

        return redirect('/admin/accounts')->with('success', 'Account aggiornato con successo!');
    }

    /**
     * Elimina un utente dal sistema.
     */
    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return redirect('/admin/accounts')->with('success', 'Utente rimosso.');
    }
}