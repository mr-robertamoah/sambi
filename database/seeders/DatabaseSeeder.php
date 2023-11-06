<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\Product;
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

                Product::factory()->count(50)->create([
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
                $randPermission = Permission::all()->random();
                $user->assignedPermissions()->attach($randPermission->id, ["assigner_id"=> 1]);
            })
            ->create();
    }
}
