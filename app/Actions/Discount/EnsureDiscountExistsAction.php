<?php

namespace App\Actions\Discount;

use App\Actions\Action;
use App\DTOs\DiscountDTO;
use App\DTOs\SaleDTO;
use App\Exceptions\DiscountException;

class EnsureDiscountExistsAction extends Action
{
    public function execute(DiscountDTO|SaleDTO $discountDTO)
    {
        if ($discountDTO->discount) return;

        throw new DiscountException("Sorry, a discount is required to perform this action.", 422);
    }
}