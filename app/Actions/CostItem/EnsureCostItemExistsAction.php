<?php

namespace App\Actions\CostItem;

use App\Actions\Action;
use App\DTOs\CostDTO;
use App\DTOs\CostItemDTO;
use App\Exceptions\CostItemException;

class EnsureCostItemExistsAction extends Action
{
    public function execute(CostItemDTO|CostDTO $costItemDTO)
    {
        if ($costItemDTO->costItem) return;

        throw new CostItemException("Sorry, a cost item is required to perform this action.", 422);
    }
}