<?php

namespace App\Actions\Cost;

use App\Actions\Action;
use App\DTOs\CostDTO;
use App\Models\Cost;

class UpdateCostAction extends Action
{
    public function execute(CostDTO $costDTO) : Cost
    {
        $data = [
            "number_of_units" => $costDTO->numberOfUnits,
            "date" => $costDTO->date,
            "note" => $costDTO->note,
            "cost_item_id" => $costDTO->costItemId,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $costDTO->cost;
        
        $costDTO->cost->update($data);

        return $costDTO->cost->refresh();
    }
}