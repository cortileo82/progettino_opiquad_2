<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ClientAssignmentController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('users:take-free-client');
        
        $availableClients = User::role(User::ROLE_CLIENT) 
            // 1. Usiamo una funzione per gestire i vari stati di "vuoto" di trainer_id
            ->where(function ($query) {
                $query->whereNull('trainer_id')
                      ->orWhere('trainer_id', ''); // Protezione se non è un vero NULL
            })
            ->select('id', 'name', 'email')
            // 2. Usiamo trim() per evitare che spazi vuoti nella ricerca nascondano tutto
            ->when(trim($request->search), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('pt/clients/assign', [
            'availableClients' => $availableClients,
            'filters' => [
                'search' => $request->search ?? '' // Assicura che search sia almeno stringa vuota
            ]
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('users:take-free-client');

        $validated = $request->validate([
            'client_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    // La validazione deve essere speculare alla query della index
                    $query->whereNull('trainer_id')
                          ->orWhere('trainer_id', '');
                })
            ],
        ]);

        $client = User::findOrFail($validated['client_id']);

        // 3. Verifichiamo che l'utente sia effettivamente un CLIENT
        if (!$client->hasRole(User::ROLE_CLIENT)) {
             abort(403, "L'utente selezionato non è un atleta.");
        }

        $client->update([
            'trainer_id' => $request->user()->id
        ]);

        return redirect()->route('pt.clients.index')
            ->with('success', "Hai preso in carico l'atleta {$client->name} con successo!");
    }
}