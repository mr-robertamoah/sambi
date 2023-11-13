<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ["name", "path", "size", "mime", "description", "disk", "filename"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function productFiles()
    {
        return $this->morphedByMany(Product::class,"fileable", "fileables");
    }

    public function userFiles()
    {
        return $this->morphedByMany(User::class,"fileable", "fileables");
    }
}
