<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Visualizza la lista di tutti gli utenti.
     */
    public function index()
    {
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
        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/create', [
            'personalTrainers' => $personalTrainers
        ]);
    }

    /**
     * Salva il nuovo utente nel database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'password'   => 'required|string|min:8',
            'role'       => 'required|in:admin,pt,client',
            'pt_id'      => 'nullable', // Gestito manualmente sotto
        ]);

        // Logica per il trainer_id in fase di creazione
        $trainerId = null;
        if ($validated['role'] === 'client' && $request->pt_id !== 'none') {
            $trainerId = $request->pt_id;
        }

        User::create([
            'name'       => $validated['first_name'] . ' ' . $validated['last_name'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'role'       => $validated['role'],
            'trainer_id' => $trainerId,
        ]);

        return Inertia::render('admin/accounts/success');
    }

    /**
     * Aggiorna i dati dell'utente (Usato dalla modale in index.tsx).
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password'   => 'nullable|string|min:8',
            'role'       => 'required|in:admin,pt,client',
            'trainer_id' => 'nullable', // Validato manualmente
        ]);

        // 1. Gestione Password: la aggiorniamo solo se fornita
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // 2. Trasformiamo "none" del frontend in NULL per il database
        $trainerId = null;
        if ($validated['role'] === 'client' && $request->trainer_id !== 'none' && !empty($request->trainer_id)) {
            $trainerId = $request->trainer_id;
        }

        // 3. Aggiornamento dati
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        $user->trainer_id = $trainerId;
        
        $user->save();

        return redirect('/admin/accounts')->with('success', 'Account aggiornato con successo!');
    }

    /**
     * Elimina un utente dal sistema.
     */
    public function destroy(User $user)
    {
        // Impedisci all'utente loggato di eliminarsi da solo
        if (auth()->id() === $user->id) {
            return back()->withErrors(['error' => 'Operazione non consentita sul proprio account.']);
        }

        $user->delete();

        return redirect('/admin/accounts')->with('success', 'Utente rimosso.');
    }
}