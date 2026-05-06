<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Plan;
use App\Enums\Billing\StripeEvent;
use App\Enums\Billing\StripeMode;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Metodo che riceve la chiamata da Stripe
     */
    public function handle(Request $request) {

        // --- Sicurezza ----

        // Non si utilizza $request->all() perché serve il formato grezzo della stringa JSON per la crittografia.
        $payload = $request->getContent(); 
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            // L'SDK di Stripe ricalcola l'hash.
            // Se la firma non combacia, allora si lancia un'eccezione e si passa al blocco "catch"
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch(\UnexpectedValueException | SignatureVerificationException $e) {
            // Potrebbe essere che qualcuno abbia mandato un JSON finto
            // Lo si blocca e si restituisce errore 404
            Log::warning('Webhook Stripe try failed: signature not valid.');
            return response()->json(['error' => 'Signature not valid'], 400);
        }

        // ---- Routing ----

        // Poiché Stripe invia diversi tipi di eventi (rimborsi, dispute, ...), allora si filtrano solo i pagamenti completati.
        if($event->type === StripeEvent::CheckoutCompleted->value) {
            // Si recupera l'oggetto "Sessione" creato in CheckoutController
            $session = $event->data->object;

            // A seconda della proprietà "mode" si smista il lavoro a metodi privati
            if($session->mode === StripeMode::Subscription->value) {
                $this->handleSubscription($session);
            } elseif($session->mode === StripeMode::Payment->value) {
                $this->handleOneOffPayment($session);
            }
        }

        // ---- Acknowledgment ----

        return response()->json(['status' => 'success']);

    }

    private function handleSubscription($session) {
        // Stripe resituisce l'ID dell'utente che ha pagato (ID del DB di Tempra passato da CheckoutController)
        $user = User::find($session->client_reference_id);

        if($user) {
            $user->update([
                'is_premium' => true,
                // Si salva l'ID del cliente usato da Stripe per future reference (Es.: per annullare l'abbonamento) (Foreign Key Virtuale)
                'stripe_id' => $session->customer,
            ]);

            Log::info("Webhook: l'utente {$user->email} è diventato PRO.");
        }
    }

    private function handelOneOffPayment($request) {
        // Si recupera l'ID della scheda da comprare dai metadati che si erano "nascosti" 
        // nell'oggetto "Sessione" in CheckoutController
        $planId = $session->metadata->plan_id ?? null;

        if($planId) {
            $plan = Plan::find($planId);

            if($plan) {
                $plan->update([
                    'is_paid' => true,
                    // Si salva l'ID della transazione Stripe per eventuali rimborsi
                    'stripe_payment_intent' => $session->payment_intent,
                ]);

                Log::info("Webhook: la scheda con ID {$plan->id} è stata sbloccata.");
            }
        }
    }
}
