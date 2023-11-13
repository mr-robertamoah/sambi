<?php

namespace App\Actions\Discount;

use App\Actions\Action;
use App\DTOs\DiscountDTO;

class DeleteDiscountAction extends Action
{
    public function execute(DiscountDTO $discountDTO)
    {
        return $discountDTO->discount->delete();
    }
}