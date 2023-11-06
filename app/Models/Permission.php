<?php

namespace App\Models;

use App\Traits\HasActivityItemableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    use HasActivityItemableTrait;

    protected $fillable = ["date", "number_of_units", "product_id"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, "permission_user", "permission_id")
            ->withTimestamps();
    }

    public function scopeWherePermissionName($query, string $name)
    {
        return $query->where(function ($query) use ($name) {
            $query->where("name", $name);
        });
    }

    public function scopeWherePermissionIsLike($query, string $name)
    {
        return $query->where(function ($query) use ($name) {
            $query->where("name", "LIKE", "%{$name}%");
        });
    }

    public function scopeWherePermissionNames($query, array $names)
    {
        return $query->where(function ($query) use ($names) {
            $query->whereIn("name", $names);
        });
    }
}
