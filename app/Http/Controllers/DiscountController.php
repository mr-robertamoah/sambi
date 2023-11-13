<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\DiscountDTO;
use App\Enums\PaginationEnum;
use App\Http\Requests\CreateDiscountRequest;
use App\Http\Requests\UpdateDiscountRequest;
use App\Http\Resources\DiscountResource;
use App\Models\Discount;
use App\Services\DiscountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function index()
    {
        return Inertia::render("Discounts/Index", [
            "discounts"=> DiscountResource::collection(
                Discount::query()->latest()->paginate(PaginationEnum::GET_MANY->value)
            ),
        ]);
    }

    public function create(CreateDiscountRequest $request)
    {
        try {
            DiscountService::make()->createDiscount(
                DiscountDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description,
                    "type" => $request->type,
                    "amount" => $request->amount,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateDiscountRequest $request)
    {
        try {
            DiscountService::make()->updateDiscount(
                DiscountDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "discountId" => $request->discount,
                    "description" => $request->description,
                    "type" => $request->type,
                    "amount" => $request->amount,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function delete(Request $request)
    {
        try {
            DiscountService::make()->deleteDiscount(
                DiscountDTO::new()->fromArray([
                    "user" => $request->user(),
                    "discountId" => $request->discount,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
