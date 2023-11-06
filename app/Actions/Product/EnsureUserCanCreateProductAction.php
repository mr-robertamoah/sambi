<?php

namespace App\Actions\Product;
use App\Actions\Action;
use App\DTOs\ProductDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\ProductException;

class EnsureUserCanCreateProductAction extends Action
{
    public function execute (ProductDTO $productDTO)
    {
        if (
            $productDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_CREATE_PRODUCT->value,
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_PRODUCT->value,
            ])
        ) return;

        throw new ProductException("Sorry, you are not permitted to create a product on this platform. Alert administrator if you think this is a mistake.", 422);
    }
}