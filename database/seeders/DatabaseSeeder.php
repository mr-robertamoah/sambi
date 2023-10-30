<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()
            ->afterCreating(function (User $user) {
                $permission = Permission::factory()->create([
                    "name"=> PermissionEnum::manageAll->value,
                    "user_id" => $user->id
                ]);

                $user->assignedPermissions()->attach($permission->id, ["assigner_id" => $user->id]);
            })
            ->create([
                "name" => "Robert Amoah",
                "email" => "mr_robertamoah@yahoo.com",
                "password"=> bcrypt("itisme2025"),
            ]);

        

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
