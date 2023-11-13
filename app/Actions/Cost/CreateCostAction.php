<?php

namespace App\Actions\Cost;

use App\Actions\Action;
use App\DTOs\CostDTO;
use App\Models\Cost;

class CreateCostAction extends Action
{
    public function execute(CostDTO $costDTO): Cost
    {
        return $costDTO->user->addedCosts()->create([
            "number_of_units" => $costDTO->numberOfUnits,
            "date" => $costDTO->date,
            "cost_item_id" => $costDTO->costItemId,
            "note" => $costDTO->note,
        ]);
    }
}