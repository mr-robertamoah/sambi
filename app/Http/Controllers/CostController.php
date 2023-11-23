<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\CostDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreateCostRequest;
use App\Http\Requests\UpdateCostRequest;
use App\Http\Resources\MiniCostItemResource;
use App\Http\Resources\CostResource;
use App\Http\Resources\MiniUserResource;
use App\Models\Cost;
use App\Models\CostItem;
use App\Models\User;
use App\Services\CostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CostController extends Controller
{
    public function index(Request $request)
    {
        $permitted = $request->user()?->isPermittedTo(names: [
            PermissionEnum::CAN_MANAGE_ALL->value,
            PermissionEnum::CAN_MANAGE_COST->value,
        ]);

        $query = Cost::query();
        $filtered = false;
        
        if ($request->user_id) {
            $query->whereAddedByUserWithId($request->user_id);
            $filtered = true;
        };
        if ($request->cost_item_id) {
            $query->whereIsForCostItemWithId($request->cost_item_id);
            $filtered = true;
        }
        if ($request->date) {
            $query->whereOnDate($request->date);
            $filtered = true;
        }
        if ($request->date_start && $request->date_end) {
            $query->whereBetweenDates($request->date_start, $request->date_end);
            $filtered = true;
        }

        return Inertia::render('Costs/Index', [
            "costs" => $permitted ? CostResource::collection(
                    $query->latest()->paginate(PaginationEnum::GET_MANY->value)
                ) : [],
            "users" => $permitted ? MiniUserResource::collection(
                User::query()->whereAddedCost()->get()
            ) : [],
            "costItems" => $permitted ? MiniCostItemResource::collection(
                CostItem::all()
            ) : [],
            "filtered" => $filtered,
            "filteredData" => array_map(fn ($value) => $value == "null" ? null : $value, $request->all())
        ]);
    }

    public function create(CreateCostRequest $request)
    {
        try {
            CostService::new()->createCost(
                CostDTO::new()->fromArray([
                    "user" => $request->user(),
                    "note" => $request->note,
                    "numberOfUnits" => $request->number_of_units,
                    "costItemId" => $request->cost_item_id,
                    "date" => $request->date,
                ])
            );

            return Redirect::back()->with("success","Cost have been successfully created.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateCostRequest $request)
    {
        try {
            CostService::new()->updateCost(
                CostDTO::new()->fromArray([
                    "user" => $request->user(),
                    "note" => $request->note,
                    "numberOfUnits" => $request->number_of_units,
                    "costItemId" => $request->cost_item_id,
                    "date" => $request->date,
                    "costId" => $request->cost,
                ])
            );

            return Redirect::back()->with("success","Cost have been successfully updated.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function remove(Request $request)
    {
        try {
            CostService::new()->deleteCost(
                CostDTO::new()->fromArray([
                    "user" => $request->user(),
                    "costId" => $request->cost,
                ])
            );

            return Redirect::back()->with("success","Cost have been successfully deleted.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
