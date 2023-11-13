<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Suggestion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ["message"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
