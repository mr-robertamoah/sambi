<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\DiscountDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreateDiscountRequest;
use App\Http\Requests\UpdateDiscountRequest;
use App\Http\Resources\DiscountResource;
use App\Http\Resources\MiniUserResource;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\UserResource;
use App\Models\Discount;
use App\Models\Permission;
use App\Models\User;
use App\Services\DiscountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function index(Request $request)
    {
        // check if user has permission to assign permissions before sending users and permission
        $permitted = $request->user()->isPermittedTo(names: [
            PermissionEnum::CAN_ASSIGN_PERMISSION->value,
            PermissionEnum::CAN_MANAGE_USER->value,
            PermissionEnum::CAN_MANAGE_ALL->value,
        ]);

        return Inertia::render("Discounts/Index", [
            "discounts"=> DiscountResource::collection(
                Discount::query()->latest()->paginate(PaginationEnum::GET_MANY->value)
            ),
            "users" => $permitted ? MiniUserResource::collection(User::query()->whereNotPermittedTo([
                PermissionEnum::CAN_APPLY_DISCOUNT->value,
                PermissionEnum::CAN_MANAGE_DISCOUNT->value,
                PermissionEnum::CAN_MANAGE_ALL->value
            ])->get()) : [],
            "permission" => $permitted ? 
                new PermissionResource(Permission::where("name", PermissionEnum::CAN_APPLY_DISCOUNT->value)->first())
                : null
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

    public function remove(Request $request)
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
