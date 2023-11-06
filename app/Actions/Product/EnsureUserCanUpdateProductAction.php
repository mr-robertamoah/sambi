<?php

namespace App\Actions\Product;
use App\Actions\Action;
use App\DTOs\ProductDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\ProductException;

class EnsureUserCanUpdateProductAction extends Action
{
    public function execute (ProductDTO $productDTO)
    {
        if (
            $productDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_PRODUCT->value,
            ]) ||
            $productDTO->user->addedProduct($productDTO->product)
        ) return;

        throw new ProductException("Sorry, you are not permitted to update product with {$productDTO->product->name} name. Alert administrator if you think this is a mistake.", 422);
    }
}