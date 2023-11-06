<?php

namespace App\Actions\Product;

use App\Actions\Action;
use App\DTOs\ProductDTO;

class DeleteProductAction extends Action
{
    public function execute(ProductDTO $productDTO)
    {
        return $productDTO->product->delete();
    }
}