<?php

namespace App\Actions\Category;

use App\Actions\Action;
use App\DTOs\CategoryDTO;
use App\Exceptions\CategoryException;

class EnsurecategoryExistsAction extends Action
{
    public function execute(CategoryDTO $categoryDTO)
    {
        if ($categoryDTO->category) return;

        throw new CategoryException("Sorry, a category is required to perform this action.", 422);
    }
}