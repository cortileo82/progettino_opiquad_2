<?php

namespace App\Enums\Billing;

enum StripeMode: string
{
    case Subscription = 'subscription';
    case Payment = 'payment';
}