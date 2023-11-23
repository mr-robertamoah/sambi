<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\CostItemDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreateCostItemRequest;
use App\Http\Requests\UpdateCostItemRequest;
use App\Http\Resources\CostItemResource;
use App\Models\CostItem;
use App\Services\CostItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CostItemController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson()) return response()->json([
            "costItems" => $request->no_permissions ? CostItemResource::collection(CostItem::all()) : []
        ]);

        return Inertia::render('CostItems/Index', [
            "costItems" => $request->user()?->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_COST_ITEM->value,
            ]
            ) ? CostItemResource::collection(
                    CostItem::paginate(PaginationEnum::GET_MANY->value)
                ) : [],
        ]);
    }

    public function create(CreateCostItemRequest $request)
    {
        try {
            CostItemService::new()->createCostItem(
                CostItemDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description,
                    "unit" => $request->unit,
                    "categoryId" => $request->category_id,
                    "unitCharge" => $request->unit_charge,
                ])
            );

            return Redirect::back()->with("success","CostItem have been successfully created.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateCostItemRequest $request)
    {
        try {
            CostItemService::new()->updateCostItem(
                CostItemDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description,
                    "unit" => $request->unit,
                    "unitCharge" => $request->unit_charge,
                    "categoryId" => $request->category_id,
                    "costItemId" => $request->cost_item,
                ])
            );

            return Redirect::back()->with("success","CostItem have been successfully updated.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function remove(Request $request)
    {
        try {
            CostItemService::new()->deleteCostItem(
                CostItemDTO::new()->fromArray([
                    "user" => $request->user(),
                    "costItemId" => $request->cost_item,
                ])
            );

            return Redirect::back()->with("success","CostItem have been successfully deleted.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
