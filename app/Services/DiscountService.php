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
use App\DTOs\ActivityDTO;
use App\DTOs\DiscountDTO;
use App\Enums\ActivityActionEnum;

class DiscountService extends BaseService
{
    public function createDiscount(DiscountDTO $discountDTO)
    {
        EnsureUserExistsAction::make()->execute($discountDTO);

        EnsureUserCanCreateDiscountAction::make()->execute($discountDTO);

        $discount = CreateDiscountAction::make()->execute($discountDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $discountDTO->user,
                "itemable" => $discount,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );
        
        return $discount;
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

        $discount = UpdateDiscountAction::make()->execute($discountDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $discountDTO->user,
                "itemable" => $discount,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $discount;
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

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $discountDTO->user,
                "itemable" => $discountDTO->discount,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteDiscountAction::make()->execute($discountDTO);
    }
}