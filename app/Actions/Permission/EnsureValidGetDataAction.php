<?php

namespace App\Actions\Permission;

use App\Actions\Action;
use App\Exceptions\PermissionException;
use MrRobertAmoah\DTO\BaseDTO;

class EnsureValidGetDataAction extends Action
{
    public function execute(
        BaseDTO $dto,
        string $exception = PermissionException::class,
        string $type = "permission"
    )
    {
        if ($dto->user->isAdmin() || $dto->isForNextPage()) return;
        
        if (
            ($type == "role" && $dto->permissionName) ||
            $dto->name ||
            $dto->like ||
            $dto->class
        ) return;

        throw new $exception("Sorry! You are required to provide at least name, like or class.", 422);
    }
}