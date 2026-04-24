<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use App\Models\User; 
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|string|exists:roles,name',                  // Solo i ruoli prestabiliti sono accettati

            // "Accetta e valida il trainer_id se e solo se il ruolo inviato è quello del client. 
            // Altrimenti, scarta questo campo e rimuovilo dai dati validati, come se non fosse mai stato inviato."
            'trainer_id' => [
                'exclude_unless:role,' . User::ROLE_CLIENT, 
                'nullable', 
                'exists:users,id'
            ],
        ];
    }
}
