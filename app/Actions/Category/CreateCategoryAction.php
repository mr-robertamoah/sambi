<?php

namespace App\Actions\Category;

use App\Actions\Action;
use App\DTOs\CategoryDTO;
use App\Models\Category;

class CreateCategoryAction extends Action
{
    public function execute(CategoryDTO $categoryDTO): Category
    {
        return $categoryDTO->user->addedCategories()->create([
            "name" => $categoryDTO->name,
            "description" => $categoryDTO->description,
        ]);
    }
}