<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ["date", "number_of_units", "product_id", "buyer_name", "note", "discount_id"];

    protected $dates = ["date"];

    protected $casts = [
        "date" => "datetime",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function scopeWhereAddedByUserWithId($query, $userId)
    {
        return $query->where(function ($query) use ($userId) {
            $query->where("user_id", $userId);
        });
    }

    public function scopeWhereIsForProductWithId($query, $productId)
    {
        return $query->where(function ($query) use ($productId) {
            $query->where("product_id", $productId);
        });
    }

    public function scopeWhereIsForDiscountWithId($query, $discountId)
    {
        return $query->where(function ($query) use ($discountId) {
            $query->where("discount_id", $discountId);
        });
    }

    public function scopeWhereBoughtBy($query, $name)
    {
        return $query->where(function ($query) use ($name) {
            $query->where("buyer_name", "LIKE", "%{$name}%");
        });
    }

    public function scopeWhereOnDate($query, $date)
    {
        if (!strtotime($date)) return $query;

        return $query->where(function ($query) use ($date) {
            $query->where("date", Carbon::parse($date)->toDateTimeString());
        });
    }

    public function scopeWhereBetweenDates($query, $startDate, $endDate)
    {
        if (!strtotime($startDate) || !strtotime($endDate)) return $query;
        
        return $query->where(function ($query) use ($startDate, $endDate) {
            $query->whereBetween("date", [
                Carbon::parse($startDate)->toDateTimeString(),
                Carbon::parse($endDate)->toDateTimeString(),
            ]);
        });
    }
}
