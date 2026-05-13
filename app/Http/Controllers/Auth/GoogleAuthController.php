<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    /**
     * Reindirizza l'utente alla pagina di login di Google.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Gestisce la risposta da Google dopo l'autenticazione.
     */
    public function callback()
    {
        try {
            // Socialite estrae i dati in modo sicuro verificando il token
            $googleUser = Socialite::driver('google')->user();

            // Flusso 1: l'utente si è già loggato con Google in passato
            $user = User::where('google_id', $googleUser->getId())->first();

            if(!$user) {
                // Flusso 2: gestione della collisione fra email.
                //           Verifica quando l'utente non ha un google_id, ma la sua email esiste nel DB.
                $user = User::where('email', $googleUser->getEmail())->first();

                if($user) {
                    // L'utente si era registrato con email/pwd
                    // Si "unisocno" l'account Google a quello esistente
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        // 'avatar'    => $user->avatar ?? $googleUser->getAvatar(), 
                    ]);
                } else {
                    // Flusso 3: utente completamente nuovo. Registrazione automatica.
                    $user = User::create([
                        'name'      => $googleUser->getName(),
                        'email'     => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        // 'avatar'    => $googleUser->getAvatar(),

                        // Si genera una password casuale forte perché il DB la richiede.
                        // In ogni caso l'utente accederà sempre con Google.
                        'password'  => Hash::make(Str::random(32)),
                        'is_premium'=> false,                           // Default di business
                    ]);

                    // Si assegna subito il ruolo base
                    $user->assignRole(User::ROLE_CLIENT ?? 'client');
                }
            }

            // Si autentica l'utente
            Auth::login($user, true);   // true = "Ricordami" impostato di default

            // Si reindirizza alla dashbaord (Il file di rotte smisterà l'utente alla sua dashboard corretta)
            return redirect()->intended(route('dashbaord'));
        } catch(\Exception $e) {
            Log::error('Errore durante il Login con Google: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Autenticazione con Google fallita. Riprova.');
        }
    }
}
