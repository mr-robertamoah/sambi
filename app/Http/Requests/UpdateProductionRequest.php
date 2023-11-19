<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required_without_all:quantity,date,note,product_id",
            "note" => "required_without_all:name,quantity,date,product_id",
            "quantity" => "required_without_all:name,date,note,product_id",
            "date" => "required_without_all:quantity,name,note,product_id|nullable|before:tomorrow",
            "product_id" => ["required_without_all:quantity,name,note,date", "nullable", Rule::exists(Product::class, "id")],
        ];
    }
}
