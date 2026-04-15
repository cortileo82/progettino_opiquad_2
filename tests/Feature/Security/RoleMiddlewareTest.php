<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

// RefreshDatabase è FONDAMENTALE. Dice a Laravel di creare le tabelle 
// nel database in memoria prima di ogni test e di distruggerle alla fine.
uses(RefreshDatabase::class);

test('un cliente NON puo accedere alla dashboard del personal trainer', function () {
    
    // 1. ARRANGE (Prepara il tavolo operatorio)
    // Usiamo il Factory per creare un utente finto con ruolo 'client'
    $cliente = User::factory()->create([
        'role' => 'client',
    ]);

    // 2. ACT (Agisci)
    // Diciamo a Laravel: "Fai finta che l'utente loggato sia $cliente 
    // e fagli fare una chiamata GET alla rotta protetta del PT"
    $response = $this->actingAs($cliente)->get('/pt/dashboard');

    // 3. ASSERT (Verifica)
    // Cosa ci aspettiamo? Che il Middleware 'role:pt' intervenga e blocchi l'accesso.
    // In Laravel, di solito i middleware personalizzati rispondono con 403 (Forbidden) o 404 (Not Found).
    // Se nel tuo Middleware hai scritto "abort(403)", qui verifichiamo il 403.
    $response->assertStatus(403); 
});

test('un personal trainer PUO accedere alla sua dashboard', function () {
    
    // 1. ARRANGE
    $pt = User::factory()->create([
        'role' => 'pt',
    ]);

    // 2. ACT
    $response = $this->actingAs($pt)->get('/pt/dashboard');

    // 3. ASSERT
    // Se ha il ruolo giusto, Laravel non lo blocca. Il controller processa la richiesta
    // e restituisce la pagina con successo (Status 200 OK).
    $response->assertStatus(200); 
});