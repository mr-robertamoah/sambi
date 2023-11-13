<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\SaleDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreateSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Http\Resources\MiniDiscountResource;
use App\Http\Resources\MiniProductResource;
use App\Http\Resources\MiniUserResource;
use App\Http\Resources\SaleResource;
use App\Models\Discount;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $permitted = $request->user()?->isPermittedTo(names: [
            PermissionEnum::CAN_MANAGE_ALL->value,
            PermissionEnum::CAN_MANAGE_SALE->value,
        ]);

        $query = Sale::query();
        $filtered = false;
        
        if ($request->user_id) {
            $query->whereAddedByUserWithId($request->user_id);
            $filtered = true;
        };
        if ($request->product_id) {
            $query->whereIsForProductWithId($request->product_id);
            $filtered = true;
        }
        if ($request->discount_id) {
            $query->whereIsForDiscountWithId($request->discount_id);
            $filtered = true;
        }
        if ($request->buyer_name) {
            $query->whereBoughtBy($request->buyer_name);
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

        return Inertia::render('Sales/Index', [
            "sales" => $permitted ? SaleResource::collection(
                    $query->latest()->paginate(PaginationEnum::GET_MANY->value)
                ) : [],
            "users" => $permitted ? MiniUserResource::collection(
                User::query()->whereAddedSale()->get()
            ) : [],
            "products" => $permitted ? MiniProductResource::collection(
                Product::all()
            ) : [],
            "discounts" => $permitted ? MiniDiscountResource::collection(
                Discount::all()
            ) : [],
            "filtered" => $filtered,
            "filteredData" => array_map(fn ($value) => $value == "null" ? null : $value, $request->all())
        ]);
    }

    public function create(CreateSaleRequest $request)
    {
        try {
            SaleService::new()->createSale(
                SaleDTO::new()->fromArray([
                    "user" => $request->user(),
                    "note" => $request->note,
                    "buyerName" => $request->buyer_name,
                    "numberOfUnits" => $request->number_of_units,
                    "productId" => $request->product_id,
                    "discountId" => $request->discount_id,
                    "date" => $request->date,
                ])
            );

            return Redirect::back()->with("success","Sale have been successfully created.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateSaleRequest $request)
    {
        try {
            SaleService::new()->updateSale(
                SaleDTO::new()->fromArray([
                    "user" => $request->user(),
                    "note" => $request->note,
                    "numberOfUnits" => $request->number_of_units,
                    "productId" => $request->product_id,
                    "discountId" => $request->discount_id,
                    "date" => $request->date,
                    "buyerName" => $request->buyer_name,
                    "saleId" => $request->sale,
                ])
            );

            return Redirect::back()->with("success","Sale have been successfully updated.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function delete(Request $request)
    {
        try {
            SaleService::new()->deleteSale(
                SaleDTO::new()->fromArray([
                    "user" => $request->user(),
                    "saleId" => $request->sale,
                ])
            );

            return Redirect::back()->with("success","Sale have been successfully deleted.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
