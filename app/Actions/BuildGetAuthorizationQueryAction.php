<?php

namespace App\Actions;

use App\DTOs\PermissionDTO;
use App\Enums\PermissionEnum;
use Illuminate\Database\Eloquent\Builder;

class BuildGetAuthorizationQueryAction extends Action
{
    public function execute(Builder $query, PermissionDTO $dto) : Builder
    {
        $query->whereNot("name", PermissionEnum::CAN_MANAGE_ALL->value);
        if ($dto->like) $query->wherePermissionIsLike($dto->like);
        if ($dto->assigneeId) $query->whereNotAssignedTo($dto->assigneeId);

        $query->latest();

        return $query;
    }
}