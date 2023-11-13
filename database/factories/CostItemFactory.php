<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CostItem>
 */
class CostItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => $this->faker->name,
            "description" => $this->faker->sentence,
            "unit" => ["per truck", "per trip", "per person", "per round"][random_int(0,3)],
            "unit_charge" => round(rand(100, 1000) / 5, 2),
        ];
    }
}
