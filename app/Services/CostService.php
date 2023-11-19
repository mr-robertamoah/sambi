<?php

namespace App\Services;

use App\Actions\Cost\CreateCostAction;
use App\Actions\Cost\DeleteCostAction;
use App\Actions\Cost\EnsureUserCanCreateCostAction;
use App\Actions\Cost\EnsureUserCanUpdateCostAction;
use App\Actions\Cost\EnsureCostExistsAction;
use App\Actions\Cost\UpdateCostAction;
use App\Actions\CostItem\EnsureCostItemExistsAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\GetModelFromDTOAction;
use App\DTOs\ActivityDTO;
use App\DTOs\CostDTO;
use App\Enums\ActivityActionEnum;

class CostService extends BaseService
{
    public function createCost(CostDTO $costDTO)
    {
        EnsureUserExistsAction::make()->execute($costDTO);

        $costDTO = $costDTO->withCostItem(
            GetModelFromDTOAction::make()->execute(
                $costDTO, "costItem", "costItem"
            )
        );

        EnsureCostItemExistsAction::make()->execute($costDTO);

        EnsureUserCanCreateCostAction::make()->execute($costDTO);

        $cost = CreateCostAction::make()->execute($costDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $costDTO->user,
                "itemable" => $cost,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );
        
        return $cost;
    }

    public function updateCost(CostDTO $costDTO)
    {
        EnsureUserExistsAction::make()->execute($costDTO);

        $costDTO = $costDTO->withCost(
            GetModelFromDTOAction::make()->execute(
                $costDTO, "cost", "cost"
            )
        );

        EnsureCostExistsAction::make()->execute($costDTO);

        if ($costDTO->costItemId) {
            $costDTO = $costDTO->withCostItem(
                GetModelFromDTOAction::make()->execute(
                    $costDTO, "costItem", "costItem"
                )
            );
    
            EnsureCostItemExistsAction::make()->execute($costDTO);
        }

        EnsureUserCanUpdateCostAction::make()->execute($costDTO);

        $cost = UpdateCostAction::make()->execute($costDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $costDTO->user,
                "itemable" => $cost,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $cost;
    }

    public function deleteCost(CostDTO $costDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($costDTO);

        $costDTO = $costDTO->withCost(
            GetModelFromDTOAction::make()->execute(
                $costDTO, "cost", "cost"
            )
        );

        EnsureCostExistsAction::make()->execute($costDTO);

        EnsureUserCanUpdateCostAction::make()->execute($costDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $costDTO->user,
                "itemable" => $costDTO->cost,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteCostAction::make()->execute($costDTO);
    }
}