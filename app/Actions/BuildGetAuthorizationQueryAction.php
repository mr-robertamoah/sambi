<?php

namespace App\Actions;

use App\DTOs\PermissionDTO;
use Illuminate\Database\Eloquent\Builder;

class BuildGetAuthorizationQueryAction extends Action
{
    public function execute(Builder $query, PermissionDTO $dto) : Builder
    {
        if ($dto->name) $query->wherePermissionName($dto->name);
        if ($dto->like) $query->wherePermissionIsLike($dto->like);

        $query->latest();

        return $query;
    }
}