<?php

namespace App\Actions\Product;

use App\Actions\Action;
use App\DTOs\ProductDTO;
use App\DTOs\ProductionDTO;
use App\DTOs\SaleDTO;
use App\Exceptions\ProductException;

class EnsureProductExistsAction extends Action
{
    public function execute(ProductDTO|SaleDTO|ProductionDTO $productDTO)
    {
        if ($productDTO->product) return;

        throw new ProductException("Sorry, a product is required to perform this action.", 422);
    }
}