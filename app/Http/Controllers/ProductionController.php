<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\ProductionDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreateProductionRequest;
use App\Http\Requests\UpdateProductionRequest;
use App\Http\Resources\MiniProductResource;
use App\Http\Resources\MiniUserResource;
use App\Http\Resources\ProductionResource;
use App\Models\Product;
use App\Models\Production;
use App\Models\User;
use App\Services\ProductionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function index(Request $request)
    {
        $permitted = $request->user()?->isPermittedTo(names: [
            PermissionEnum::CAN_MANAGE_ALL->value,
            PermissionEnum::CAN_MANAGE_SALE->value,
        ]);

        $query = Production::query();
        $filtered = false;
        
        if ($request->user_id) {
            $query->whereAddedByUserWithId($request->user_id);
            $filtered = true;
        };
        if ($request->product_id) {
            $query->whereIsForProductWithId($request->product_id);
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

        return Inertia::render('Production/Index', [
            "production" => $permitted ? ProductionResource::collection(
                    $query->latest()->paginate(PaginationEnum::GET_MANY->value)
                ) : [],
            "users" => $permitted ? MiniUserResource::collection(
                User::query()->whereAddedProduction()->get()
            ) : [],
            "products" => $permitted ? MiniProductResource::collection(
                Product::all()
            ) : [],
            "filtered" => $filtered,
            "filteredData" => array_map(fn ($value) => $value == "null" ? null : $value, $request->all())
        ]);
    }

    public function create(CreateProductionRequest $request)
    {
        try {
            ProductionService::new()->createProduction(
                ProductionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "note" => $request->note,
                    "productId" => $request->product_id,
                    "quantity" => $request->quantity,
                    "date" => $request->date,
                ])
            );

            return Redirect::back()->with("success","Production have been successfully created.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateProductionRequest $request)
    {
        try {
            ProductionService::new()->updateProduction(
                ProductionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "note" => $request->note,
                    "productId" => $request->product_id,
                    "quantity" => $request->quantity,
                    "productionId" => $request->production,
                ])
            );

            return Redirect::back()->with("success","Production have been successfully updated.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function remove(Request $request)
    {
        try {
            ProductionService::new()->deleteProduction(
                ProductionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "productionId" => $request->production,
                ])
            );

            return Redirect::back()->with("success","Production have been successfully deleted.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
