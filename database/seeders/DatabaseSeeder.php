<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Enums\PermissionEnum;
use App\Models\Category;
use App\Models\Cost;
use App\Models\CostItem;
use App\Models\Permission;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()
            ->afterCreating(function (User $user) {
                $permission = Permission::factory()->create([
                    "name"=> PermissionEnum::CAN_MANAGE_ALL->value,
                    "user_id" => $user->id
                ]);

                $user->assignedPermissions()->attach($permission->id, ["assigner_id" => $user->id]);

                Product::factory()->count(5)->create([
                    "user_id" => $user->id
                ]);
            })
            ->create([
                "name" => "Robert Amoah",
                "email" => "mr_robertamoah@yahoo.com",
                "password"=> bcrypt("itisme2025"),
            ]);

        foreach (
            array_filter(
                PermissionEnum::values(),
                fn($value) => $value != PermissionEnum::CAN_MANAGE_ALL->value
            ) as $permissionName
        ) {
            Permission::factory()->create([
                "name"=> $permissionName,
                "user_id" => $user->id
            ]);
        }

        User::factory()
            ->count(9)
            ->afterCreating(function ($user) {
                $randPermission = Permission::query()
                    ->whereNot("name", PermissionEnum::CAN_MANAGE_ALL->value)
                    ->get()->random();
                $user->assignedPermissions()->attach($randPermission->id, ["assigner_id"=> 1]);

                Product::factory()->count(2)
                    ->afterCreating(function ($product) use ($user) {
                        Sale::factory()->count(5)->create([
                            "product_id" => $product->id,
                            "user_id" => $user->id,
                        ]);
                    })
                    ->create([
                        "user_id" => $user->id
                    ]);
            })
            ->create();

        Category::factory()
            ->count(2)
            ->afterCreating(function ($category) {
                CostItem::factory()
                    ->count(2)
                    ->afterCreating(function ($costItem) {
                        Cost::factory()
                            ->count(2)
                            ->create([
                                "user_id"=> $costItem->user_id,
                                "cost_item_id" => $costItem->id
                            ]);
                    })
                    ->create([
                        "user_id" => $category->user_id,
                        "category_id" => $category->id
                    ]);
            })
            ->create([
                "user_id" => User::all()->random()->id
            ]);
    }
}
