<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClientAssignmentController extends Controller
{
    /**
     * Visualizza la lista dei clienti che non hanno ancora un PT
     */
    public function index()
    {
        // Prendiamo solo gli utenti con ruolo 'client' e trainer_id NULL
        $availableClients = User::where('role', 'client')
            ->whereNull('trainer_id')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('pt/clients/assign', [
            'availableClients' => $availableClients
        ]);
    }

    /**
     * Associa il PT loggato al cliente selezionato
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:users,id',
        ]);

        // Troviamo il cliente e verifichiamo che sia ancora "libero"
        $client = User::where('role', 'client')
            ->whereNull('trainer_id')
            ->findOrFail($request->client_id);

        // Aggiorniamo il trainer_id con l'ID del PT loggato 
        $client->update([
            'trainer_id' => Auth::id()
        ]);

        return redirect()->route('pt.dashboard')
            ->with('message', "Atleta {$client->name} aggiunto con successo!");
    }
}