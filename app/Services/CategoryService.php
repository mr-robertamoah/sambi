<?php

namespace App\Services;

use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\DeleteCategoryAction;
use App\Actions\Category\EnsurecategoryExistsAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\Category\EnsureUserCanCreateCategoryAction;
use App\Actions\Category\EnsureUserCanUpdateCategoryAction;
use App\Actions\Category\UpdateCategoryAction;
use App\Actions\GetModelFromDTOAction;
use App\DTOs\CategoryDTO;

class CategoryService extends BaseService
{
    public function createCategory(CategoryDTO $categoryDTO)
    {
        EnsureUserExistsAction::make()->execute($categoryDTO);

        EnsureUserCanCreateCategoryAction::make()->execute($categoryDTO);

        return CreateCategoryAction::make()->execute($categoryDTO);
    }

    public function updateCategory(CategoryDTO $categoryDTO)
    {
        EnsureUserExistsAction::make()->execute($categoryDTO);

        $categoryDTO = $categoryDTO->withCategory(
            GetModelFromDTOAction::make()->execute(
                $categoryDTO, "category", "category"
            )
        );

        EnsurecategoryExistsAction::make()->execute($categoryDTO);

        EnsureUserCanUpdateCategoryAction::make()->execute($categoryDTO);

        return UpdateCategoryAction::make()->execute($categoryDTO);
    }

    public function deleteCategory(CategoryDTO $categoryDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($categoryDTO);

        $categoryDTO = $categoryDTO->withCategory(
            GetModelFromDTOAction::make()->execute(
                $categoryDTO, "category", "category"
            )
        );

        EnsureCategoryExistsAction::make()->execute($categoryDTO);

        EnsureUserCanUpdateCategoryAction::make()->execute($categoryDTO);

        return DeleteCategoryAction::make()->execute($categoryDTO);
    }
}