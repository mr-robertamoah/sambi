<?php

namespace App\Http\Requests;

use App\Models\CostItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCostRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required_without_all:number_of_units,date,description,cost_item_id",
            "description" => "required_without_all:name,number_of_units,date,cost_item_id",
            "number_of_units" => "required_without_all:name,date,description,cost_item_id",
            "date" => "required_without_all:number_of_units,name,description,cost_item_id|nullable|before:tomorrow",
            "cost_item_id" => ["required_without_all:number_of_units,name,description,date", "nullable", Rule::exists(CostItem::class, "id")],
        ];
    }
}
