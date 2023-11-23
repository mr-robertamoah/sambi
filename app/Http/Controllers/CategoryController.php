<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\CategoryDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson()) return response()->json([
            "categories" => $request->no_permissions ? CategoryResource::collection(Category::all()) : []
        ]);

        return Inertia::render('Categories/Index', [
            "categories" => $request->user()?->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_CATEGORY->value,
            ]
            ) ? CategoryResource::collection(
                    Category::paginate(PaginationEnum::GET_MANY->value)
                ) : [],
        ]);
    }

    public function create(CreateCategoryRequest $request)
    {
        try {
            CategoryService::new()->createCategory(
                CategoryDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description
                ])
            );

            return Redirect::back()->with("success","Category have been successfully created.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateCategoryRequest $request)
    {
        try {
            CategoryService::new()->updateCategory(
                CategoryDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description,
                    "categoryId" => $request->category,
                ])
            );

            return Redirect::back()->with("success","Category have been successfully updated.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function remove(Request $request)
    {
        try {
            CategoryService::new()->deleteCategory(
                CategoryDTO::new()->fromArray([
                    "user" => $request->user(),
                    "categoryId" => $request->category,
                ])
            );

            return Redirect::back()->with("success","Category have been successfully deleted.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
