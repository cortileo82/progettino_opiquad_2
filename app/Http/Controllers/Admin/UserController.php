<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // 1. Si recuperano gli utenti
        $users = User::latest()->get();

        // 2. Si restituiscono gli utenti
        return Inertia::render('admin/users/index', ['users' => $users]);
    }

    public function create()
    {
        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/create', [
            'personalTrainers' => $personalTrainers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,pt,client',
            'pt_id' => 'nullable|exists:users,id',
        ]);

        User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'trainer_id' => $validated['role'] === 'client' ? $validated['pt_id'] : null,
        ]);

        return redirect()->route('admin.accounts.index')->with('success', 'Utente creato.');
    }
}

        // 1. Si resituisce il form di creazione di un utente
        return Inertia::render('admin/users/create');
    }

    public function store(StoreUserRequest $request, User $user)
    {
        // 1. Si validano i dati della richiesta
        $data = $request->validated();

        // 2. Si cripta la password prima di salvarla
        $data['password'] = Hash::make($data['password']);

        // 3. Si crea effettivamente l'utente
        User::create($data);

        // 4. Si reindirizza alla route per l'index
        return redirect()->route('admin.users.index')->with('success', 'User created successfully!');
    }

    public function edit(User $user)
    {
        // 1. Si restituisce il form di modifica di un utente
        return Inertia::render('admin/users/index', ['user' => $user]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        // 1. Si validano i dati della richiesta
        $data = $request->validated();

        // 2. Se vi è una nuova password, allora la si cripta, 
        //    altrimenti la si rimuove dall'array per evitare rischi di aggiornamento password
        if($request->filled('password')) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // 3. Si aggiorna l'utente
        $user->update($data);

        // 4. Si reindirizza alla route per l'index
        return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');

    }

    public function destroy(User $user)
    {
        // 1. PREVENZIONE: L'admin non può cancellare se stesso
        if(auth()->id() === $user->id) {
            return redirect()->back()->withErrors(['error' => 'You cannot delete yourself from the system']);
        }

        // 2. Si elimina l'utente
        $user->delete();

        // 3. Si reindirizza alla route dell'index
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully!');
    }
}

