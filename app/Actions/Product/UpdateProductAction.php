<?php

namespace App\Actions\Product;

use App\Actions\Action;
use App\DTOs\ProductDTO;
use App\Exceptions\UserException;
use App\Models\Product;
use MrRobertAmoah\DTO\BaseDTO;

class UpdateProductAction extends Action
{
    public function execute(ProductDTO $productDTO) : Product
    {
        $data = [
            "name" => $productDTO->name,
            "selling_price" => $productDTO->sellingPrice,
            "description" => $productDTO->description,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $productDTO->product;
        
        $productDTO->product->update($data);

        return $productDTO->product->refresh();
    }
}