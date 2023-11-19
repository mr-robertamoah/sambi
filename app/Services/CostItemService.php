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
use App\DTOs\ActivityDTO;
use App\DTOs\CostItemDTO;
use App\Enums\ActivityActionEnum;

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

        $costItem = CreateCostItemAction::make()->execute($costItemDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $costItemDTO->user,
                "itemable" => $costItem,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );
        
        return $costItem;
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

        $costItem = UpdateCostItemAction::make()->execute($costItemDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $costItemDTO->user,
                "itemable" => $costItem,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $costItem;
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

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $costItemDTO->user,
                "itemable" => $costItemDTO->costItem,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteCostItemAction::make()->execute($costItemDTO);
    }
}