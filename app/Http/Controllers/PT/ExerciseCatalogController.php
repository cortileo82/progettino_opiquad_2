<?php 

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExerciseCatalogController extends Controller
{
    public function __invoke(Request $request)
    {
        Gate::authorize('viewCatalog', Exercise::class);

        $exercises = Exercise::with('muscleGroup')      // Eager Loading
            ->searchWithMuscleGroup($request->search)   // Applicazione filtri se l'utente sta cercando
            ->orderBy('name')                           // Ordinamento
            ->paginate()                                // Paginazione definita nel Model (varabile "$perPage")
            ->withQueryString();                        // e aggiunta link per le pagine successive

        return Inertia::render('pt/catalog', [
            'exercises' => $exercises,
            'filters' => $request->only(['search'])
        ]);
    }
}