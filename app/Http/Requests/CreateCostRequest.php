<?php

namespace App\Http\Requests;

use App\Models\CostItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCostRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "number_of_units" => "required|integer",
            "date" => "required|date|before:tomorrow",
            "cost_item_id" => ["required", "string", Rule::exists(CostItem::class, "id")],
            "note" => "nullable|string",
        ];
    }
}
