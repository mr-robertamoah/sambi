<?php

namespace App\Actions\Discount;

use App\Actions\Action;
use App\DTOs\DiscountDTO;
use App\Models\Discount;

class UpdateDiscountAction extends Action
{
    public function execute(DiscountDTO $discountDTO) : Discount
    {
        $data = [
            "name" => $discountDTO->name,
            "description" => $discountDTO->description,
            "amount" => $discountDTO->amount,
            "type" => $discountDTO->type,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $discountDTO->discount;
        
        $discountDTO->discount->update($data);

        return $discountDTO->discount->refresh();
    }
}