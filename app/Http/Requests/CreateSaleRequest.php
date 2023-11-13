<?php

namespace App\Http\Requests;

use App\Models\Discount;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateSaleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "buyer_name" => "nullable|string",
            "number_of_units" => "required|integer",
            "date" => "required|date|before:tomorrow",
            "product_id" => ["required", "string", Rule::exists(Product::class, "id")],
            "discount_id" => ["nullable", "string", Rule::exists(Discount::class, "id")],
            "note" => "nullable|string",
        ];
    }
}
