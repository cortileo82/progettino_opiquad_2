<?php

namespace App\Http\Requests;
use App\Enums\MuscleGroup; 
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExerciseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;    // L'autorizzazione è già gestita dal Middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'muscle_group' => ['required', Rule::enum(MuscleGroup::class)], // Si verifica che il MuscleGroup sia valido
        ];
    }
}
