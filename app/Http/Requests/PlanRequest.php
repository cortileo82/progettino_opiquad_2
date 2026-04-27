<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Plan;

class PlanRequest extends FormRequest
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
            // Validazione Testata Scheda
            'user_id'     => 'required|exists:users,id',
            'name'        => 'required|string|max:255',
            'num_weeks'   => 'required|integer|min:1',
            
            // Validazione Array Esercizi 
            'exercises'   => 'required|array|min:1', 
            'exercises.*.exercise_id' => 'required|exists:exercises,id',
            'exercises.*.sets'        => 'required|integer|min:1',
            'exercises.*.reps'        => 'required|integer|min:1',
            'exercises.*.day_of_week' => 'required|string',
            'exercises.*.week_number' => 'required|integer|min:1',
            'exercises.*.rest_time'   => 'nullable|string',
            'exercises.*.weight_kg' => 'nullable|numeric|min:0',
        ];
    }
}
