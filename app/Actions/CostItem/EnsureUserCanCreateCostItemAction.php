<?php

namespace App\Actions\CostItem;

use App\Actions\Action;
use App\DTOs\CostItemDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\CostItemException;

class EnsureUserCanCreateCostItemAction extends Action
{
    public function execute (CostItemDTO $costItem)
    {
        if (
            $costItem->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_COST_ITEM->value,
            ])
        ) return;

        throw new CostItemException("Sorry, you are not permitted to create a cost item on this platform. Alert administrator if you think this is a mistake.", 422);
    }
}