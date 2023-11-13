<?php

namespace App\Services;

use App\Actions\Category\EnsureCategoryExistsAction;
use App\Actions\CostItem\CreateCostItemAction;
use App\Actions\CostItem\DeleteCostItemAction;
use App\Actions\CostItem\EnsureUserCanCreateCostItemAction;
use App\Actions\CostItem\EnsureUserCanUpdateCostItemAction;
use App\Actions\CostItem\EnsureCostItemExistsAction;
use App\Actions\CostItem\UpdateCostItemAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\GetModelFromDTOAction;
use App\DTOs\CostItemDTO;

class CostItemService extends BaseService
{
    public function createCostItem(CostItemDTO $costItemDTO)
    {
        EnsureUserExistsAction::make()->execute($costItemDTO);

        $costItemDTO = $costItemDTO->withCost(
            GetModelFromDTOAction::make()->execute(
                $costItemDTO, "category", "category"
            )
        );

        EnsureCategoryExistsAction::make()->execute($costItemDTO);

        EnsureUserCanCreateCostItemAction::make()->execute($costItemDTO);

        return CreateCostItemAction::make()->execute($costItemDTO);
    }

    public function updateCostItem(CostItemDTO $costItemDTO)
    {
        EnsureUserExistsAction::make()->execute($costItemDTO);

        $costItemDTO = $costItemDTO->withCostItem(
            GetModelFromDTOAction::make()->execute(
                $costItemDTO, "costItem", "costItem"
            )
        );

        EnsureCostItemExistsAction::make()->execute($costItemDTO);

        if ($costItemDTO->categoryId) {
            $costItemDTO = $costItemDTO->withCost(
                GetModelFromDTOAction::make()->execute(
                    $costItemDTO, "category", "category"
                )
            );
    
            EnsureCategoryExistsAction::make()->execute($costItemDTO);
        }

        EnsureUserCanUpdateCostItemAction::make()->execute($costItemDTO);

        return UpdateCostItemAction::make()->execute($costItemDTO);
    }

    public function deleteCostItem(CostItemDTO $costItemDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($costItemDTO);

        $costItemDTO = $costItemDTO->withCostItem(
            GetModelFromDTOAction::make()->execute(
                $costItemDTO, "costItem", "costItem"
            )
        );

        EnsureCostItemExistsAction::make()->execute($costItemDTO);

        EnsureUserCanUpdateCostItemAction::make()->execute($costItemDTO);

        return DeleteCostItemAction::make()->execute($costItemDTO);
    }
}