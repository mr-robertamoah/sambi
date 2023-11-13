<?php

namespace App\Actions\Cost;

use App\Actions\Action;
use App\DTOs\CostDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\CostException;

class EnsureUserCanCreateCostAction extends Action
{
    public function execute (CostDTO $costDTO)
    {
        if (
            $costDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_COST->value,
            ])
        ) return;

        throw new CostException("Sorry, you are not permitted to create a cost on this platform. Alert administrator if you think this is a mistake.", 422);
    }
}