<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Production>
 */
class ProductionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => User::all()->random()->id,
            "product_id" => Product::all()->random()->id,
            "date" => $this->faker->dateTimeThisYear(),
            "quantity" => $this->faker->numberBetween(10,100),
        ];
    }
}
