<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Exercise;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminExerciseTest extends TestCase
{
    // Questo trait è MAGICO. Prima di ogni test pulisce il database, 
    // e dopo ogni test cancella tutto quello che ha creato. 
    // Così i test non si "sporcano" tra loro e non riempiono il tuo vero DB.
    use RefreshDatabase;

    /**
     * TEST 1: Solo un admin può vedere la pagina degli esercizi
     */
    public function test_admin_can_view_exercises_index()
    {
        // ARRANGE: Creiamo un utente falso con ruolo admin
        $admin = User::factory()->create(['role' => 'admin']);

        // ACT: Simuliamo che questo admin faccia una richiesta GET alla pagina
        $response = $this->actingAs($admin)->get('/admin/exercises');

        // ASSERT: Verifichiamo che la pagina risponda con successo (codice 200)
        $response->assertStatus(200);
    }

    /**
     * TEST 2: Un admin può creare un nuovo esercizio
     */
    public function test_admin_can_create_an_exercise()
    {
        // ARRANGE: Creiamo e logghiamo l'admin
        $admin = User::factory()->create(['role' => 'admin']);

        // I dati che invieremmo normalmente dal form frontend
        $exerciseData = [
            'name' => 'Panca Piana',
            'muscle_group' => 'Petto',
            'description' => 'Spingi forte verso l\'alto',
        ];

        // ACT: Simuliamo l'invio del form tramite POST
        $response = $this->actingAs($admin)->post('/admin/exercises', $exerciseData);

        // ASSERT: 
        // 1. Controlliamo che dopo il salvataggio ci sia un redirect (codice 302)
        $response->assertStatus(302);
        
        // 2. Il test VERO: controlliamo che nel Database esista davvero questa riga!
        $this->assertDatabaseHas('exercises', [
            'name' => 'Panca Piana',
            'muscle_group' => 'Petto',
        ]);
    }

    /**
     * TEST 3: Un admin può eliminare un esercizio
     */
    public function test_admin_can_delete_an_exercise()
    {
        // ARRANGE: Creiamo l'admin e un esercizio fittizio nel DB
        $admin = User::factory()->create(['role' => 'admin']);
        $exercise = Exercise::factory()->create([
            'name' => 'Squat'
        ]);

        // ACT: Simuliamo il click sul tasto "Elimina" (richiesta DELETE)
        $response = $this->actingAs($admin)->delete('/admin/exercises/' . $exercise->id);

        // ASSERT:
        // Controlliamo che l'esercizio sia effettivamente sparito dal database
        $this->assertDatabaseMissing('exercises', [
            'id' => $exercise->id,
        ]);
    }
}