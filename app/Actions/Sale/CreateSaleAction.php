<?php

namespace App\Actions\Sale;

use App\Actions\Action;
use App\DTOs\SaleDTO;
use App\Models\Sale;

class CreateSaleAction extends Action
{
    public function execute(SaleDTO $saleDTO): Sale
    {
        return $saleDTO->user->addedSales()->create([
            "number_of_units" => $saleDTO->numberOfUnits,
            "date" => $saleDTO->date,
            "product_id" => $saleDTO->productId,
            "discount_id" => $saleDTO->discountId,
            "note" => $saleDTO->note,
            "buyer_name" => $saleDTO->buyerName,
        ]);
    }
}