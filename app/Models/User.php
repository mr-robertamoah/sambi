<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\PermissionEnum;
use App\Traits\HasFileableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use HasFileableTrait;
    use SoftDeletes;

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

    public function addedCostItems()
    {
        return $this->hasMany(CostItem::class);
    }

    public function addedCosts()
    {
        return $this->hasMany(Cost::class);
    }

    public function addedSales()
    {
        return $this->hasMany(Sale::class);
    }

    public function addedDiscounts()
    {
        return $this->hasMany(Discount::class);
    }

    public function addedCategories()
    {
        return $this->hasMany(Category::class);
    }

    public function addedPermissions()
    {
        return $this->hasMany(Permission::class);
    }

    public function addedProductions()
    {
        return $this->hasMany(Production::class);
    }

    public function addedActivities()
    {
        return $this->hasMany(Activity::class);
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

    public function isNotPermittedTo(
        ?string $name = null,
        ?array $names = null,
    ) {
        return !$this->isPermittedTo(name: $name, names: $names);
    }

    public function addedProduct($product)
    {
        return $product->user->is($this);
    }

    public function addedCostItem($costItem)
    {
        return $costItem->user->is($this);
    }

    public function addedCost($cost)
    {
        return $cost->user->is($this);
    }

    public function addedProduction($production)
    {
        return $production->user->is($this);
    }

    public function addedSale($sale)
    {
        return $sale->user->is($this);
    }

    public function addedDiscount($discount)
    {
        return $discount->user->is($this);
    }

    public function addedCategory($category)
    {
        return $category->user->is($this);
    }

    public function scopeWhereCannotManageAll($query)
    {
        return $query->where(function ($query) {
            $query->whereDoesntHave("assignedPermissions", function ($query) {
                $query->where("name", PermissionEnum::CAN_MANAGE_ALL->value);
            });
        });
    }

    public function scopeWhereAddedCost($query)
    {
        return $query->where(function ($query) {
            $query->whereHas("addedCosts");
        });
    }

    public function scopeWhereAddedSale($query)
    {
        return $query->where(function ($query) {
            $query->whereHas("addedSales");
        });
    }

    public function scopeWhereAddedProduction($query)
    {
        return $query->where(function ($query) {
            $query->whereHas("addedProductions");
        });
    }

    public function scopeWhereNotPermittedTo($query, $permissions)
    {
        return $query->where(function ($query) use ($permissions) {
            $query->whereDoesntHave("assignedPermissions", function ($query) use ($permissions) {
                $query->whereIn("name", $permissions);
            });
        });
    }
}
