<?php

namespace App\Actions\Production;

use App\Actions\Action;
use App\DTOs\ProductionDTO;

class DeleteProductionAction extends Action
{
    public function execute(ProductionDTO $productionDTO)
    {
        return $productionDTO->production->delete();
    }
}