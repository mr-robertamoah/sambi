<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasFileableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use HasFileableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function createdPermissions()
    {
        return $this->hasMany(Permission::class, "permission_id");
    }

    public function assigningPermissions()
    {
        return $this->belongsToMany(Permission::class, "permission_user", "assigner_id")
            ->withTimestamps()
            ->withPivot("assignee_id");
    }

    public function assignedPermissions()
    {
        return $this->belongsToMany(Permission::class, "permission_user", "assignee_id")
            ->withTimestamps()
            ->withPivot(["assigner_id"])
            ->withPivot(["id"]);
    }

    public function suggestions()
    {
        return $this->hasMany(Suggestion::class);
    }

    public function addedFiles()
    {
        return $this->hasMany(File::class);
    }

    public function addedProducts()
    {
        return $this->hasMany(Product::class);
    }

    public function addedCategories()
    {
        return $this->hasMany(Category::class);
    }

    public function addedPermissions()
    {
        return $this->hasMany(Permission::class);
    }

    public function isPermittedTo(
        ?string $name = null,
        ?array $names = null,
    ) {
        $query = $this->assignedPermissions();

        if ($name) $query->wherePermissionName($name);
        if ($names) $query->wherePermissionNames($names);
        
        return $query->exists();
    }

    public function addedProduct($product)
    {
        return $product->user->is($this);
    }

    public function addedCategory($category)
    {
        return $category->user->is($this);
    }
}
