<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\Role; 
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;    // L'autorizzazione del ruolo è gestita dal middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Si recupera l'ID dell'utente che si sta modificando dall'URL
        $userId = $this->route('user')->id;

        return [
            'name'     => 'required|string|max:255',
            // L'email deve essere unica, TRANNE per la riga con questo ID
            'email'    => 'required|string|email|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:8',                  // Nullable
            'role'     => ['required', Rule::enum(Role::class)],   // Solo i 3 ruoli prestabiliti sono accettati
        ];
    }
}
