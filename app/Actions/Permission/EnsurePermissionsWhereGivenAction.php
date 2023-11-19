<?php

namespace App\Actions\Permission;
use App\Actions\Action;
use App\DTOs\PermissionDTO;
use App\Exceptions\PermissionException;

class EnsurePermissionsWhereGivenAction extends Action
{
    public function execute(PermissionDTO $permissionDTO)
    {
        if (count($permissionDTO->permissionIds) > 0) return;

        throw new PermissionException("Sorry! You need to provide the permissions to be assigned to user.", 422);
    }
}