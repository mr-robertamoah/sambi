<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "number_of_units" => $this->faker->numberBetween(1,20),
            "date" => $this->faker->dateTimeBetween("-1 year"),
            "buyer_name" => $this->faker->name()
        ];
    }
}
