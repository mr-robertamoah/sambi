<?php

namespace App\Models;

use App\Traits\HasActivityItemableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostItem extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasActivityItemableTrait;

    protected $fillable = ["name", "description", "unit_charge", "unit", "category_id"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
