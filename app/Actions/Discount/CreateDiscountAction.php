<?php

namespace App\Actions\Discount;

use App\Actions\Action;
use App\DTOs\DiscountDTO;
use App\Models\Discount;

class CreateDiscountAction extends Action
{
    public function execute(DiscountDTO $discountDTO): Discount
    {
        return $discountDTO->user->addedDiscounts()->create([
            "name" => $discountDTO->name,
            "description" => $discountDTO->description,
            "amount" => $discountDTO->amount,
            "type" => $discountDTO->type,
        ]);
    }
}