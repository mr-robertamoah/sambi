<?php

namespace App\Models;

use App\Traits\HasActivityItemableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discount extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasActivityItemableTrait;

    protected $fillable = ["name", "description", "type", "amount"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
