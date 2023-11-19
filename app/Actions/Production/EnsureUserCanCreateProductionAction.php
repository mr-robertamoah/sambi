<?php

namespace App\Actions\Production;

use App\Actions\Action;
use App\DTOs\ProductionDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\ProductionException;

class EnsureUserCanCreateProductionAction extends Action
{
    public function execute (ProductionDTO $productionDTO)
    {
        if (
            $productionDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_PRODUCTION->value,
            ])
        ) return;

        throw new ProductionException("Sorry, you are not permitted to create a production on this platform. Alert administrator if you think this is a mistake.", 422);
    }
}