<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use App\Enums\Role; 
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Si recupera l'id dell'utente dall'URL
        $userToUpdate = $this->route('user');
        
        return Gate::allows('update', $userToUpdate);
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
            'email'    => 'required|string|email|max:255|unique:users,email,' . $userId,    // L'email deve essere unica, TRANNE per la riga con questo ID
            'password' => 'nullable|string|min:8',                                          // Nullable
            'role'     => ['required', Rule::enum(Role::class)],                            // Solo i 3 ruoli prestabiliti sono accettati
            'trainer_id' => 'nullable|exists:users,id',                                     // Nullable
        ];
    }
}
