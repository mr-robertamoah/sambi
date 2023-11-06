<?php

namespace App\Actions\Permission;

use App\Actions\Action;
use App\DTOs\PermissionDTO;
use App\Models\Authorization;

class DeletePermissionAction extends Action
{
    public function execute(PermissionDTO $permissionDTO) : bool
    {
        $permissionDTO->permission->assignedUsers()->detach();
        return (bool) $permissionDTO->permission->delete();
    }
}