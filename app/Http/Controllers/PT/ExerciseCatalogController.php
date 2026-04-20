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

        $exercises = Exercise::orderBy('muscle_group')->orderBy('name')->get();
        
        return Inertia::render('pt/catalog', [
            'exercises' => $exercises
        ]);
    }
}