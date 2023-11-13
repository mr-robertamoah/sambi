<?php

namespace App\Actions\Sale;

use App\Actions\Action;
use App\DTOs\SaleDTO;
use App\Models\Sale;

class UpdateSaleAction extends Action
{
    public function execute(SaleDTO $saleDTO) : Sale
    {
        $data = [
            "number_of_units" => $saleDTO->numberOfUnits,
            "date" => $saleDTO->date,
            "product_id" => $saleDTO->productId,
            "discount_id" => $saleDTO->discountId,
            "note" => $saleDTO->note,
            "buyer_name" => $saleDTO->buyerName,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $saleDTO->sale;
        
        $saleDTO->sale->update($data);

        return $saleDTO->sale->refresh();
    }
}