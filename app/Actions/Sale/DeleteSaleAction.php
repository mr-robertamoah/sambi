<?php

namespace App\Actions\Sale;

use App\Actions\Action;
use App\DTOs\SaleDTO;

class DeleteSaleAction extends Action
{
    public function execute(SaleDTO $saleDTO)
    {
        return $saleDTO->sale->delete();
    }
}