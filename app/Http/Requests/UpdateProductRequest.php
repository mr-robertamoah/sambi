<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required_without_all:selling_price,file,file_id,description",
            "description" => "required_without_all:name,selling_price,file,file_id",
            "selling_price" => "required_without_all:name,file,file_id,description",
            "file" => "required_without_all:selling_price,name,description,file_id",
            "file_id" => "required_without_all:selling_price,name,description,file",
        ];
    }
}
