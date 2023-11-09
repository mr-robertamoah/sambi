<?php

namespace App\Actions\Permission;
use App\Actions\Action;
use App\DTOs\PermissionDTO;
use App\Models\User;

class SyncPermissionsAndUserAction extends Action
{
    public function execute(PermissionDTO $permissionDTO): User
    {
        $relatedIds = $permissionDTO->assignee->assignedPermissions()->allRelatedIds()->toArray();
    
        $permissionDTO->assignee->assignedPermissions()->detach(
            array_intersect($permissionDTO->permissionIds, $relatedIds)
        );
        $permissionDTO->assignee->assignedPermissions()->attach(
            array_diff($permissionDTO->permissionIds, $relatedIds)
        , ["assigner_id" => $permissionDTO->user->id]);

        return $permissionDTO->assignee->refresh();
    }
}