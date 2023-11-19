<?php

namespace App\Actions\Production;

use App\Actions\Action;
use App\DTOs\ProductionDTO;
use App\Models\Production;

class CreateProductionAction extends Action
{
    public function execute(ProductionDTO $productionDTO): Production
    {
        return $productionDTO->user->addedProductions()->create([
            "quantity" => $productionDTO->quantity,
            "date" => $productionDTO->date,
            "product_id" => $productionDTO->productId,
            "note" => $productionDTO->note,
        ]);
    }
}