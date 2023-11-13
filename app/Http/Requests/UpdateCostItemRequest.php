<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCostItemRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required_without_all:unit_charge,unit,description,category_id",
            "description" => "required_without_all:name,unit_charge,unit,category_id",
            "unit_charge" => "required_without_all:name,unit,description,category_id",
            "unit" => "required_without_all:unit_charge,name,description,category_id",
            "category_id" => "required_without_all:unit_charge,name,description,unit",
        ];
    }
}
