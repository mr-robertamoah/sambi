<?php

namespace App\Actions\Discount;

use App\Actions\Action;
use App\DTOs\DiscountDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\DiscountException;

class EnsureUserCanCreateDiscountAction extends Action
{
    public function execute (DiscountDTO $discountDTO)
    {
        if (
            $discountDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_DISCOUNT->value,
            ])
        ) return;

        throw new DiscountException("Sorry, you are not permitted to create a discount on this platform. Alert administrator if you think this is a mistake.", 422);
    }
}