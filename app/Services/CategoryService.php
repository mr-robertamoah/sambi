<?php

namespace App\Services;

use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\DeleteCategoryAction;
use App\Actions\Category\EnsureCategoryExistsAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\Category\EnsureUserCanCreateCategoryAction;
use App\Actions\Category\EnsureUserCanUpdateCategoryAction;
use App\Actions\Category\UpdateCategoryAction;
use App\Actions\GetModelFromDTOAction;
use App\DTOs\ActivityDTO;
use App\DTOs\CategoryDTO;
use App\Enums\ActivityActionEnum;

class CategoryService extends BaseService
{
    public function createCategory(CategoryDTO $categoryDTO)
    {
        EnsureUserExistsAction::make()->execute($categoryDTO);

        EnsureUserCanCreateCategoryAction::make()->execute($categoryDTO);

        $category = CreateCategoryAction::make()->execute($categoryDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $categoryDTO->user,
                "itemable" => $category,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );

        return $category;
    }

    public function updateCategory(CategoryDTO $categoryDTO)
    {
        EnsureUserExistsAction::make()->execute($categoryDTO);

        $categoryDTO = $categoryDTO->withCategory(
            GetModelFromDTOAction::make()->execute(
                $categoryDTO, "category", "category"
            )
        );

        EnsureCategoryExistsAction::make()->execute($categoryDTO);

        EnsureUserCanUpdateCategoryAction::make()->execute($categoryDTO);

        $category = UpdateCategoryAction::make()->execute($categoryDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $categoryDTO->user,
                "itemable" => $category,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $category;
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

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $categoryDTO->user,
                "itemable" => $categoryDTO->category,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteCategoryAction::make()->execute($categoryDTO);
    }
}