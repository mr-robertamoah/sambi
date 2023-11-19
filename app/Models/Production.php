<?php

namespace App\Models;

use App\Traits\HasActivityItemableTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Production extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasActivityItemableTrait;

    protected $fillable = ["date", "quantity", "product_id", "note"];

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

    public function scopeWhereIsForProductWithId($query, $productId)
    {
        return $query->where(function ($query) use ($productId) {
            $query->where("product_id", $productId);
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
