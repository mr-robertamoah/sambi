<?php

namespace App\Actions\Production;

use App\Actions\Action;
use App\DTOs\ProductionDTO;
use App\Exceptions\ProductionException;

class EnsureProductionExistsAction extends Action
{
    public function execute(ProductionDTO $productionDTO)
    {
        if ($productionDTO->production) return;

        throw new ProductionException("Sorry, a production is required to perform this action.", 422);
    }
}