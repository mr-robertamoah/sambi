<?php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Models\Category;
use App\Models\Cost;
use App\Models\CostItem;
use App\Models\Discount;
use App\Models\Permission;
use App\Models\Product;
use App\Models\Production;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Dashboard', [
            "products" => Product::query()->count(),
            "categories" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value, 
                    PermissionEnum::CAN_MANAGE_CATEGORY->value
                ],
            ) ? Category::query()->count() : null,
            "costItems" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_COST_ITEM->value,
                    PermissionEnum::CAN_MAKE_COST_ITEM_ENTRY->value,
            ],
            ) ? CostItem::query()->count() : null,
            "costs" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_COST->value,
                    PermissionEnum::CAN_MAKE_COST_ENTRY->value,
            ],
            ) ? Cost::query()->count() : null,
            "sales" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_SALE->value,
                    PermissionEnum::CAN_MAKE_SALE_ENTRY->value,
            ],
            ) ? Sale::query()->count() : null,
            "production" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_PRODUCTION->value,
                    PermissionEnum::CAN_MAKE_PRODUCTION_ENTRY->value,
            ],
            ) ? Production::query()->count() : null,
            "permissions" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_ASSIGN_PERMISSION->value,
                ],
            ) ? Permission::query()->count() : null,
            "discounts" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_DISCOUNT->value,
                ],
            ) ? Discount::query()->count() : null,
            "stats" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_VIEW_STATS->value,
            ],
            ) ? true : false,
            "users" => $user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_USER->value,
                    PermissionEnum::CAN_VIEW_USER->value,
                    PermissionEnum::CAN_ASSIGN_PERMISSION->value
                ],
            ) ? User::query()->whereNot("id", $user->id)->count() : null,
        ]);
    }
}
