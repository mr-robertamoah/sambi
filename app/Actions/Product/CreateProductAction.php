<?php

namespace App\Actions\Product;
use App\Actions\Action;
use App\DTOs\ProductDTO;
use App\Models\Product;

class CreateProductAction extends Action
{
    public function execute(ProductDTO $productDTO): Product
    {
        return $productDTO->user->addedProducts()->create([
            "name" => $productDTO->name,
            "selling_price" => $productDTO->sellingPrice,
            "description" => $productDTO->description,
        ]);
    }
}