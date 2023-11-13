<?php

namespace App\Actions\CostItem;

use App\Actions\Action;
use App\DTOs\CostItemDTO;
use App\Models\CostItem;

class CreateCostItemAction extends Action
{
    public function execute(CostItemDTO $costItemDTO): CostItem
    {
        return $costItemDTO->user->addedCostItems()->create([
            "name" => $costItemDTO->name,
            "description" => $costItemDTO->description,
            "unit" => $costItemDTO->unit,
            "unit_charge" => $costItemDTO->unitCharge,
            "category_id" => $costItemDTO->categoryId,
        ]);
    }
}