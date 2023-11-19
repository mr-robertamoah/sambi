<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateProductionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "quantity" => "required|integer",
            "date" => "required|date|before:tomorrow",
            "product_id" => ["required", "string", Rule::exists(Product::class, "id")],
            "note" => "nullable|string",
        ];
    }
}
