<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cost extends Model
{
    use HasFactory;

    protected $fillable = ["date", "number_of_units", "cost_item_id"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function costItem()
    {
        return $this->belongsTo(CostItem::class);
    }
}
