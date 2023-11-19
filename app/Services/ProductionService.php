<?php

namespace App\Services;

use App\Actions\Production\CreateProductionAction;
use App\Actions\Production\DeleteProductionAction;
use App\Actions\Production\EnsureUserCanCreateProductionAction;
use App\Actions\Production\EnsureUserCanUpdateProductionAction;
use App\Actions\Production\EnsureProductionExistsAction;
use App\Actions\Production\UpdateProductionAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\GetModelFromDTOAction;
use App\Actions\Product\EnsureProductExistsAction;
use App\DTOs\ActivityDTO;
use App\DTOs\ProductionDTO;
use App\Enums\ActivityActionEnum;

class ProductionService extends BaseService
{
    public function createProduction(ProductionDTO $productionDTO)
    {
        EnsureUserExistsAction::make()->execute($productionDTO);

        $productionDTO = $productionDTO->withProduct(
            GetModelFromDTOAction::make()->execute(
                $productionDTO, "product", "product"
            )
        );

        EnsureProductExistsAction::make()->execute($productionDTO);

        EnsureUserCanCreateProductionAction::make()->execute($productionDTO);

        $production = CreateProductionAction::make()->execute($productionDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $productionDTO->user,
                "itemable" => $production,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );
        
        return $production;
    }

    public function updateProduction(ProductionDTO $productionDTO)
    {
        EnsureUserExistsAction::make()->execute($productionDTO);

        $productionDTO = $productionDTO->withProduction(
            GetModelFromDTOAction::make()->execute(
                $productionDTO, "production", "production"
            )
        );

        EnsureProductionExistsAction::make()->execute($productionDTO);

        if ($productionDTO->productId) {
            $productionDTO = $productionDTO->withProductionItem(
                GetModelFromDTOAction::make()->execute(
                    $productionDTO, "product", "product"
                )
            );
    
            EnsureProductExistsAction::make()->execute($productionDTO);
        }

        EnsureUserCanUpdateProductionAction::make()->execute($productionDTO);

        $production = UpdateProductionAction::make()->execute($productionDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $productionDTO->user,
                "itemable" => $production,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $production;
    }

    public function deleteProduction(ProductionDTO $productionDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($productionDTO);

        $productionDTO = $productionDTO->withProduction(
            GetModelFromDTOAction::make()->execute(
                $productionDTO, "production", "production"
            )
        );

        EnsureProductionExistsAction::make()->execute($productionDTO);

        EnsureUserCanUpdateProductionAction::make()->execute($productionDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $productionDTO->user,
                "itemable" => $productionDTO->production,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteProductionAction::make()->execute($productionDTO);
    }
}