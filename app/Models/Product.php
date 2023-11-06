<?php

namespace App\Models;

use App\Traits\HasFileableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    use HasFileableTrait;

    protected $fillable = ["name", "description", "selling_price"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
