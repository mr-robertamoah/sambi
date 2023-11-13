<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDiscountRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required_without_all:description,type,amount",
            "description" => "required_without_all:name,type,amount",
            "type" => "required_without_all:name,description,amount",
            "amount" => "required_without_all:name,type,description",
        ];
    }
}
