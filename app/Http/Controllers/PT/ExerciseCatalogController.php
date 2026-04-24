<?php namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExerciseCatalogController extends Controller
{
    public function __invoke()
{
    // Usiamo la policy che avevamo scritto appositamente
    Gate::authorize('viewCatalog', Exercise::class);

    // Carichiamo la relazione 'muscle_group'
    $exercises = Exercise::with('muscle_group') 
        ->get()
        ->sortBy(function($exercise) {
            // Ordiniamo prima per nome del muscolo, poi per nome esercizio
            return ($exercise->muscle_group->name ?? '') . $exercise->name;
        })
        ->values(); // Resetta gli indici dell'array per evitare che JS lo veda come oggetto
    
    return Inertia::render('pt/catalog', [
        'exercises' => $exercises
    ]);
}
}