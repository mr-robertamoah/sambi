<?php

namespace App\Actions\Category;

use App\Actions\Action;
use App\DTOs\CategoryDTO;

class DeleteCategoryAction extends Action
{
    public function execute(CategoryDTO $categoryDTO)
    {
        return $categoryDTO->category->delete();
    }
}