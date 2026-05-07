<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Billing\WebhookController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Questo diventerà automaticamente l'URL pubblico: tempra.test/api/webhooks/stripe
// Esso è già protetto dal blocco try-catch con la firma criptografica nel Controller
Route::post('/webhooks/stripe', [WebhookController::class, 'handle']);
