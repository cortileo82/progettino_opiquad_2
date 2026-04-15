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
        // Carichiamo la relazione 'trainer' per vedere il coach assegnato nella tabella
        $users = User::with('trainer')->latest()->get();

        return Inertia::render('admin/accounts/index', [
            'users' => $users
        ]);
    }

    /**
     * Mostra il form per creare un nuovo utente.
     */
    public function create()
    {
        // Recuperiamo i Personal Trainer per il dropdown del form di creazione
        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/create', [
            'personalTrainers' => $personalTrainers
        ]);
    }

    /**
     * Salva il nuovo utente nel database e mostra la pagina di successo.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'password'   => 'required|string|min:8',
            'role'       => 'required|in:admin,pt,client',
            'pt_id'      => 'nullable|exists:users,id',
        ]);

        User::create([
            'name'       => $validated['first_name'] . ' ' . $validated['last_name'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'role'       => $validated['role'],
            'trainer_id' => $validated['role'] === 'client' ? $validated['pt_id'] : null,
        ]);

        // COLLEGAMENTO ALLA PAGINA SUCCESS.TSX
        // Non facciamo il redirect, ma renderizziamo direttamente il componente di successo
        return Inertia::render('admin/accounts/success');
    }

    /**
     * Mostra il form per modificare un utente esistente.
     */
    public function edit(User $user)
    {
        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/edit', [
            'user'             => $user,
            'personalTrainers' => $personalTrainers
        ]);
    }

    /**
     * Aggiorna i dati dell'utente.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password'   => 'nullable|string|min:8',
            'role'       => 'required|in:admin,pt,client',
            'trainer_id' => 'nullable|exists:users,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Per l'update torniamo alla lista con messaggio flash
        return redirect('/admin/accounts')->with('success', 'Utente aggiornato!');
    }

    /**
     * Elimina un utente dal sistema.
     */
    public function destroy(User $user)
    {
        // Prevenzione: l'admin non può auto-eliminarsi
        if (auth()->id() === $user->id) {
            return redirect()->back()->withErrors(['error' => 'Non puoi eliminare il tuo stesso account!']);
        }

        $user->delete();

        return redirect('/admin/accounts')->with('success', 'Utente eliminato correttamente.');
    }
}