<?php

namespace App\Actions\Sale;

use App\Actions\Action;
use App\DTOs\SaleDTO;
use App\Exceptions\SaleException;

class EnsureSaleExistsAction extends Action
{
    public function execute(SaleDTO $saleDTO)
    {
        if ($saleDTO->sale) return;

        throw new SaleException("Sorry, a sale is required to perform this action.", 422);
    }
}