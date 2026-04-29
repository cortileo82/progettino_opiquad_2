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

        // Creiamo la query base
        $query = Exercise::with('muscleGroup')->orderBy('name');

        // Codice per la ricerca nel catalogo
        if ($request->filled('search')) { // Se l'utente scrive nella barra entra nel if altrimenti salta 
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%") //Ricerca parziale (anche se contiene quella parola)
            ->orWhereHas('muscleGroup', function($sub) use ($search) { // cerca anche nella dabella Gruppo muscolare
                $sub->where('name', 'like', "%{$search}%");
            });
        });
        }

        $exercises = $query->paginate(10)->withQueryString();

        return Inertia::render('pt/catalog', [
            'exercises' => $exercises,
            'filters'   => $request->only(['search']) // Rimandiamo il filtro al frontend
        ]);
    }
}