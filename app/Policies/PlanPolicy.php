<?php namespace App\Policies;

use App\Models\Plan;
use App\Models\User;

class PlanPolicy
{
    public function viewAny(User $user): bool {
        return false;
    }

    public function view(User $user, Plan $plan): bool
    {
        // Se l'utente loggato è il proprietario della scheda (il cliente stesso) -> PUÒ PASSARE
        if ($user->id === $plan->user_id) {
            return true;
        }

        // Altrimenti, si applica la logica del PT (attuale trainer o creatore).
        // Nessun User::find(), perché si usa la relazione definita nel Model.
        // Si controlla che il client esista (->client) prima di chiamarne la proprietà (->trainer_id)
        $isCurrentTrainer = $plan->client && ($user->id === $plan->client->trainer_id);
        $isOriginalAuthor = $user->id === $plan->pt_id;

        return $isCurrentTrainer || $isOriginalAuthor;
    }

    public function create(User $user, User $client): bool
    {
        return $user->id === $client->trainer_id;
    }

    public function update(User $user, Plan $plan): bool
    {
        // Evita il crash se $plan->client è null
        if (!$plan->client) {
            return false;
        }

        return $user->id === $plan->client->trainer_id;
    }

    public function delete(User $user, Plan $plan): bool
    {
        if (!$plan->client) {
            return false;
        }

        return $user->id === $plan->client->trainer_id;
    }

    public function restore(User $user, Plan $plan): bool {
        return false;
    }

    public function forceDelete(User $user, Plan $plan): bool {
        return false;
    }
}