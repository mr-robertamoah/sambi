<?php

namespace App\Actions\Cost;

use App\Actions\Action;
use App\DTOs\CostDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\CostException;

class EnsureUserCanUpdateCostAction extends Action
{
    public function execute (CostDTO $costDTO)
    {
        if (
            $costDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
            ]) ||
            $costDTO->user->addedCost($costDTO->cost)
        ) return;

        throw new CostException("Sorry, you are not permitted to update cost with {$costDTO->cost->name} name. Alert administrator if you think this is a mistake.", 422);
    }
}