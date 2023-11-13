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
use App\DTOs\CostDTO;

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

        return CreateCostAction::make()->execute($costDTO);
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

        return UpdateCostAction::make()->execute($costDTO);
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

        return DeleteCostAction::make()->execute($costDTO);
    }
}