<?php

namespace App\Actions\CostItem;

use App\Actions\Action;
use App\DTOs\CostItemDTO;

class DeleteCostItemAction extends Action
{
    public function execute(CostItemDTO $costItemDTO)
    {
        return $costItemDTO->costItem->delete();
    }
}