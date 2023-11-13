<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cost extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ["date", "number_of_units", "cost_item_id", "note"];

    protected $dates = ["date"];

    protected $casts = [
        "date" => "datetime",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function costItem()
    {
        return $this->belongsTo(CostItem::class);
    }

    public function scopeWhereAddedByUserWithId($query, $userId)
    {
        return $query->where(function ($query) use ($userId) {
            $query->where("user_id", $userId);
        });
    }

    public function scopeWhereIsForCostItemWithId($query, $costItemId)
    {
        return $query->where(function ($query) use ($costItemId) {
            $query->where("cost_item_id", $costItemId);
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
