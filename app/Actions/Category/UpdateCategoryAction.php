<?php

namespace App\Actions\Category;

use App\Actions\Action;
use App\DTOs\CategoryDTO;
use App\Models\Category;

class UpdateCategoryAction extends Action
{
    public function execute(CategoryDTO $categoryDTO) : Category
    {
        $data = [
            "name" => $categoryDTO->name,
            "description" => $categoryDTO->description,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        if (count($data) === 0) return $categoryDTO->category;
        
        $categoryDTO->category->update($data);

        return $categoryDTO->category->refresh();
    }
}