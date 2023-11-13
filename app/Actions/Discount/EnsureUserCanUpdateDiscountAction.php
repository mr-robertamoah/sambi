<?php

namespace App\Actions\Discount;

use App\Actions\Action;
use App\DTOs\DiscountDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\DiscountException;

class EnsureUserCanUpdateDiscountAction extends Action
{
    public function execute (DiscountDTO $discountDTO)
    {
        if (
            $discountDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_DISCOUNT->value,
            ]) ||
            $discountDTO->user->addedDiscount($discountDTO->discount)
        ) return;

        throw new DiscountException("Sorry, you are not permitted to update discount with {$discountDTO->discount->name} name. Alert administrator if you think this is a mistake.", 422);
    }
}