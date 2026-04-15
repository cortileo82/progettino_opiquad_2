<?php

use App\Models\User;
use App\Enums\Role;
use Illuminate\Support\Facades\Hash;

test('un admin puo creare un nuovo utente', function () {
    
    // 1. ARRANGE
    $admin = User::factory()->create(['role' => Role::ADMIN->value]);
    
    $payload = [
        'name' => 'Nuovo Personal Trainer',
        'email' => 'pt@tempra.test',
        'password' => 'password123',
        'role' => Role::PT->value,
    ];

    // 2. ACT
    $response = $this->actingAs($admin)->post('/admin/users', $payload);

    // 3. ASSERT
    $response->assertRedirect(route('admin.users.index')); // Verifica il reindirizzamento corretto
    
    // Verifica che l'utente esista nel DB
    $this->assertDatabaseHas('users', [
        'email' => 'pt@tempra.test',
        'role' => Role::PT->value,
    ]);

    // Test da Senior: Verifichiamo che la password NON sia salvata in chiaro!
    $nuovoUtente = User::where('email', 'pt@tempra.test')->first();
    expect(Hash::check('password123', $nuovoUtente->password))->toBeTrue();
});

test('un admin puo modificare un utente lasciando la password vuota e la stessa email', function () {
    
    // 1. ARRANGE
    $admin = User::factory()->create(['role' => Role::ADMIN->value]);
    
    // Creiamo un cliente finto da modificare
    $cliente = User::factory()->create([
        'name' => 'Mario Rossi',
        'email' => 'mario@test.com',
        'role' => Role::CLIENT->value,
        'password' => Hash::make('vecchiapassword')
    ]);

    $payload = [
        'name' => 'Mario Rossi Modificato',
        'email' => 'mario@test.com', // Stessa email, il Doganiere non deve arrabbiarsi!
        'password' => '', // Lasciamo vuoto
        'role' => Role::CLIENT->value,
    ];

    // 2. ACT (Usiamo PUT per l'aggiornamento)
    $response = $this->actingAs($admin)->put("/admin/users/{$cliente->id}", $payload);

    // 3. ASSERT
    $response->assertValid(); // Assicuriamoci che il Doganiere abbia approvato
    
    $this->assertDatabaseHas('users', [
        'id' => $cliente->id,
        'name' => 'Mario Rossi Modificato',
    ]);

    // Verifichiamo che la password sia rimasta quella vecchia
    $clienteAggiornato = $cliente->fresh();
    expect(Hash::check('vecchiapassword', $clienteAggiornato->password))->toBeTrue();
});

test('un admin NON puo cancellare se stesso', function () {
    
    // 1. ARRANGE
    $admin = User::factory()->create(['role' => Role::ADMIN->value]);

    // 2. ACT (L'Admin tenta di fare una DELETE sul proprio ID)
    $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

    // 3. ASSERT
    // Ci aspettiamo che il controller restituisca un errore nella sessione
    $response->assertSessionHasErrors('error');
    
    // Ci aspettiamo che l'Admin esista ancora nel database
    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
    ]);
});