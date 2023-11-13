<?php

namespace App\Actions\CostItem;

use App\Actions\Action;
use App\DTOs\CostItemDTO;
use App\Models\CostItem;

class UpdateCostItemAction extends Action
{
    public function execute(CostItemDTO $costItemDTO) : CostItem
    {
        $data = [
            "name" => $costItemDTO->name,
            "description" => $costItemDTO->description,
            "unit" => $costItemDTO->unit,
            "unit_charge" => $costItemDTO->unitCharge,
            "costItem_id" => $costItemDTO->costItemId,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $costItemDTO->costItem;
        
        $costItemDTO->costItem->update($data);

        return $costItemDTO->costItem->refresh();
    }
}