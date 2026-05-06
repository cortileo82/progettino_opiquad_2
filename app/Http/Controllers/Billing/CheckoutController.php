<?php 

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\CheckoutPlanRequest;
use App\Models\Plan;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class CheckoutController extends Controller
{
    public function __construct()
    {
        // Si inizializza l'SDK di Stripe leggendo la chiave segreta dalle configurazioni
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createSubscription(Request $request)
    {
        if ($request->user()->is_premium) {
            return redirect()->back()->with('error', 'Sei già un utente PRO.');
        }

        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'subscription',
            'line_items' => [
                [
                    'price' => config('services.stripe.price_id_pro'),
                    'quantity' => 1,
                ]
            ],
            'customer_email' => $request->user()->email,
            'client_reference_id' => $request->user()->id,
            'success_url' => route('client.billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('client.billing.cancel'),
        ]);

        return Inertia::location($checkoutSession->url);
    }

    public function createOneOffPayment(CheckoutPlanRequest $request)
    {
        $plan = Plan::find($request->plan_id);

        // Si controlla se si sta tentando di pagare una scheda per sè oppure no
        Gate::authorize('view', $plan);

        if ($plan->is_paid) {
            return redirect()->back()->with('error', 'Questa scheda è già stata sbloccata.');
        }

        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => 'Sblocco Scheda: ' . $plan->name,
                            'description' => 'Durata: ' . $plan->num_weeks . ' settimane',
                        ],
                        'unit_amount' => 1599, // 15.99 Euro in centesimi
                    ],
                    'quantity' => 1,
                ]
            ],
            'metadata' => [
                'plan_id' => $plan->id,
            ],
            'customer_email' => $request->user()->email,
            'client_reference_id' => $request->user()->id,
            'success_url' => route('client.billing.success'),
            'cancel_url' => route('client.billing.cancel'),
        ]);

        return Inertia::location($checkoutSession->url);
    }
}