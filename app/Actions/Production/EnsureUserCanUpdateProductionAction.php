<?php

namespace App\Actions\Production;

use App\Actions\Action;
use App\DTOs\ProductionDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\ProductionException;

class EnsureUserCanUpdateProductionAction extends Action
{
    public function execute (ProductionDTO $productionDTO)
    {
        if (
            $productionDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
            ]) ||
            $productionDTO->user->addedProduction($productionDTO->production)
        ) return;

        throw new ProductionException("Sorry, you are not permitted to update production of {$productionDTO->production->product->name} product. Alert administrator if you think this is a mistake.", 422);
    }
}