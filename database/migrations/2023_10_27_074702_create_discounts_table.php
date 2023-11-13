<?php

use App\Enums\DiscountEnum;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->string("name");
            $table->text("description")->nullable();
            $table->enum("type", DiscountEnum::values())->default(DiscountEnum::FIXED->value);
            $table->float("amount");
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
