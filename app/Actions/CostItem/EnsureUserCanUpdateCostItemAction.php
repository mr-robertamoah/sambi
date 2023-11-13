<?php

namespace App\Actions\CostItem;

use App\Actions\Action;
use App\DTOs\CostItemDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\CostItemException;

class EnsureUserCanUpdateCostItemAction extends Action
{
    public function execute (CostItemDTO $costItemDTO)
    {
        if (
            $costItemDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_COST_ITEM->value,
            ]) ||
            $costItemDTO->user->addedCostItem($costItemDTO->costItem)
        ) return;

        throw new CostItemException("Sorry, you are not permitted to update cost item with {$costItemDTO->costItem->name} name. Alert administrator if you think this is a mistake.", 422);
    }
}