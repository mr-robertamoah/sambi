<?php

namespace App\Services;

use App\Actions\Discount\CreateDiscountAction;
use App\Actions\Discount\DeleteDiscountAction;
use App\Actions\Discount\EnsureDiscountExistsAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\Discount\EnsureUserCanCreateDiscountAction;
use App\Actions\Discount\EnsureUserCanUpdateDiscountAction;
use App\Actions\Discount\UpdateDiscountAction;
use App\Actions\GetModelFromDTOAction;
use App\DTOs\DiscountDTO;

class DiscountService extends BaseService
{
    public function createDiscount(DiscountDTO $discountDTO)
    {
        EnsureUserExistsAction::make()->execute($discountDTO);

        EnsureUserCanCreateDiscountAction::make()->execute($discountDTO);

        return CreateDiscountAction::make()->execute($discountDTO);
    }

    public function updateDiscount(DiscountDTO $discountDTO)
    {
        EnsureUserExistsAction::make()->execute($discountDTO);

        $discountDTO = $discountDTO->withDiscount(
            GetModelFromDTOAction::make()->execute(
                $discountDTO, "discount", "discount"
            )
        );

        EnsureDiscountExistsAction::make()->execute($discountDTO);

        EnsureUserCanUpdateDiscountAction::make()->execute($discountDTO);

        return UpdateDiscountAction::make()->execute($discountDTO);
    }

    public function deleteDiscount(DiscountDTO $discountDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($discountDTO);

        $discountDTO = $discountDTO->withDiscount(
            GetModelFromDTOAction::make()->execute(
                $discountDTO, "discount", "discount"
            )
        );

        EnsureDiscountExistsAction::make()->execute($discountDTO);

        EnsureUserCanUpdateDiscountAction::make()->execute($discountDTO);

        return DeleteDiscountAction::make()->execute($discountDTO);
    }
}