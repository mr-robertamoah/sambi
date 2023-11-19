<?php

namespace App\Models;

use App\Traits\HasActivityItemableTrait;
use App\Traits\HasFileableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasFileableTrait;
    use HasActivityItemableTrait;

    protected $fillable = ["name", "description", "selling_price"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
