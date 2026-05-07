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
use Stripe\Checkout\Session as StripeSession;

class WebhookController extends Controller
{
    /**
     * Metodo principale che riceve la chiamata da Stripe
     */
    public function handle(Request $request) 
    {
        // --- 1. Sicurezza e Validazione Firma ----
        $payload = $request->getContent(); 
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch(\UnexpectedValueException | SignatureVerificationException $e) {
            Log::error('Stripe Webhook Error: Signature non valida o payload corrotto.', [
                'message' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // ---- 2. Routing degli Eventi ----
        // Gestiamo il completamento della sessione di checkout
        if ($event->type === StripeEvent::CheckoutCompleted->value) {
            
            $session = $event->data->object;
            
            Log::info("Stripe Webhook ricevuto: {$event->type}", ['session_id' => $session->id]);

            // Smistamento in base alla modalità (Abbonamento o Pagamento Singolo)
            if ($session->mode === StripeMode::Subscription->value) {
                $this->handleSubscription($session);
            } elseif ($session->mode === StripeMode::Payment->value) {
                $this->handleOneOffPayment($session);
            }
        }

        // ---- 3. Risposta a Stripe ----
        // Restituiamo sempre 200 per confermare la ricezione, altrimenti Stripe continuerà a riprovare
        return response()->json(['status' => 'success']);
    }

    /**
     * Gestisce lo sblocco dell'abbonamento Premium
     */
    private function handleSubscription(StripeSession $session) 
    {
        // client_reference_id deve essere passato durante la creazione della sessione nel CheckoutController
        $userId = $session->client_reference_id;
        $user = User::find($userId);

        if ($user) {
            $user->update([
                'is_premium' => true,
                // Si salva l'ID del cliente usato da Stripe per future reference (Es.: per annullare l'abbonamento) (Foreign Key Virtuale)
                'stripe_id' => $session->customer,
            ]);

            Log::info("Webhook: l'utente {$user->email} è diventato PRO.");
        }
    }

    private function handleOneOffPayment(StripeSession $session) {
        // Si recupera l'ID della scheda da comprare dai metadati che si erano "nascosti" 
        // nell'oggetto "Sessione" in CheckoutController
        $planId = $session->metadata->plan_id ?? null;

        if ($planId) {
            $plan = Plan::find($planId);

            if ($plan) {
                $plan->update([
                    'is_paid' => true,
                    'stripe_payment_intent' => $session->payment_intent,
                ]);

                Log::info("Webhook: Piano ID {$plan->id} sbloccato correttamente.");
            } else {
                Log::warning("Webhook Warning: Pagamento ricevuto per Piano ID {$planId} ma il piano non esiste nel DB.");
            }
        } else {
            Log::warning("Webhook Warning: Pagamento One-off ricevuto senza plan_id nei metadata.");
        }
    }
}