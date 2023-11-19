<?php

namespace App\Actions\Production;

use App\Actions\Action;
use App\DTOs\ProductionDTO;
use App\Models\Production;

class UpdateProductionAction extends Action
{
    public function execute(ProductionDTO $productionDTO) : Production
    {
        $data = [
            "quantity" => $productionDTO->quantity,
            "date" => $productionDTO->date,
            "product_id" => $productionDTO->productId,
            "note" => $productionDTO->note,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $productionDTO->production;
        
        $productionDTO->production->update($data);

        return $productionDTO->production->refresh();
    }
}