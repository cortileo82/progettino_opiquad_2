<?php

namespace App\Enums\Billing;

enum StripeEvent: string
{
    case CheckoutCompleted = 'checkout.session.completed';
    case PaymentFailed = 'invoice.payment_failed';
}