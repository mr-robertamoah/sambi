<?php

namespace App\Actions\Category;

use App\Actions\Action;
use App\DTOs\CategoryDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\CategoryException;

class EnsureUserCanUpdateCategoryAction extends Action
{
    public function execute (CategoryDTO $categoryDTO)
    {
        if (
            $categoryDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_CATEGORY->value,
            ]) ||
            $categoryDTO->user->addedCategory($categoryDTO->Category)
        ) return;

        throw new CategoryException("Sorry, you are not permitted to update category with {$categoryDTO->category->name} name. Alert administrator if you think this is a mistake.", 422);
    }
}