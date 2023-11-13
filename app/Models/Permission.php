<?php

namespace App\Models;

use App\Traits\HasActivityItemableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasActivityItemableTrait;

    protected $fillable = ["name", "description"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, "permission_user", "permission_id", "assignee_id")
            ->withTimestamps()
            ->withPivot(["assigner_id"])
            ->withPivot(["id"]);
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

    public function scopeWhereNotAssignedTo($query, string|int|null $userId)
    {
        return $query->where(function ($query) use ($userId) {
            $query->whereDoesntHave("assignedUsers", function($query) use ($userId) {
                $query->where("users.id", $userId);
            });
        });
    }
}
