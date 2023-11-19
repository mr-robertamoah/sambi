<?php

namespace App\Services;

use App\Actions\Discount\EnsureDiscountExistsAction;
use App\Actions\Sale\CreateSaleAction;
use App\Actions\Sale\DeleteSaleAction;
use App\Actions\Sale\EnsureUserCanCreateSaleAction;
use App\Actions\Sale\EnsureUserCanUpdateSaleAction;
use App\Actions\Sale\EnsureSaleExistsAction;
use App\Actions\Sale\UpdateSaleAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\GetModelFromDTOAction;
use App\Actions\Product\EnsureProductExistsAction;
use App\DTOs\ActivityDTO;
use App\DTOs\SaleDTO;
use App\Enums\ActivityActionEnum;

class SaleService extends BaseService
{
    public function createSale(SaleDTO $saleDTO)
    {
        EnsureUserExistsAction::make()->execute($saleDTO);

        $saleDTO = $saleDTO->withProduct(
            GetModelFromDTOAction::make()->execute(
                $saleDTO, "product", "product"
            )
        );

        EnsureProductExistsAction::make()->execute($saleDTO);

        if ($saleDTO->discountId) {
            $saleDTO = $saleDTO->withDiscount(
                GetModelFromDTOAction::make()->execute(
                    $saleDTO, "discount", "discount"
                )
            );

            EnsureDiscountExistsAction::make()->execute($saleDTO);
        }

        EnsureUserCanCreateSaleAction::make()->execute($saleDTO);

        $sale = CreateSaleAction::make()->execute($saleDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $saleDTO->user,
                "itemable" => $sale,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );
        
        return $sale;
    }

    public function updateSale(SaleDTO $saleDTO)
    {
        EnsureUserExistsAction::make()->execute($saleDTO);

        $saleDTO = $saleDTO->withSale(
            GetModelFromDTOAction::make()->execute(
                $saleDTO, "sale", "sale"
            )
        );

        EnsureSaleExistsAction::make()->execute($saleDTO);

        if ($saleDTO->productId) {
            $saleDTO = $saleDTO->withProduct(
                GetModelFromDTOAction::make()->execute(
                    $saleDTO, "product", "product"
                )
            );
    
            EnsureProductExistsAction::make()->execute($saleDTO);
        }

        if ($saleDTO->discountId) {
            $saleDTO = $saleDTO->withDiscount(
                GetModelFromDTOAction::make()->execute(
                    $saleDTO, "discount", "discount"
                )
            );

            EnsureDiscountExistsAction::make()->execute($saleDTO);
        }

        EnsureUserCanUpdateSaleAction::make()->execute($saleDTO);

        $sale = UpdateSaleAction::make()->execute($saleDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $saleDTO->user,
                "itemable" => $sale,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $sale;
    }

    public function deleteSale(SaleDTO $saleDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($saleDTO);

        $saleDTO = $saleDTO->withSale(
            GetModelFromDTOAction::make()->execute(
                $saleDTO, "sale", "sale"
            )
        );

        EnsureSaleExistsAction::make()->execute($saleDTO);

        EnsureUserCanUpdateSaleAction::make()->execute($saleDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $saleDTO->user,
                "itemable" => $saleDTO->sale,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteSaleAction::make()->execute($saleDTO);
    }
}