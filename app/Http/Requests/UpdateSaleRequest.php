<?php

namespace App\Http\Requests;

use App\Models\Discount;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSaleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required_without_all:number_of_units,date,description,product_id,discount_id,buyer_name",
            "description" => "required_without_all:name,number_of_units,date,product_id,discount_id,buyer_name",
            "buyer_name" => "required_without_all:name,number_of_units,date,product_id,discount_id,description",
            "number_of_units" => "required_without_all:name,date,description,product_id,discount_id,buyer_name",
            "date" => "required_without_all:number_of_units,name,description,product_id,discount_id,buyer_name|nullable|before:tomorrow",
            "product_id" => ["required_without_all:number_of_units,name,description,date,buyer_name,discount_id", "nullable", Rule::exists(Product::class, "id")],
            "discount_id" => ["required_without_all:number_of_units,name,description,date,buyer_name,product_id", "nullable", Rule::exists(Discount::class, "id")],
        ];
    }
}
