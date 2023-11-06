<?php

namespace App\Actions\Permission;
use App\Actions\Action;
use App\DTOs\PermissionDTO;
use App\Exceptions\PermissionException;
use App\Models\Permission;

class EnsurePermissionsExistAction extends Action
{
    public function execute(PermissionDTO $permissionDTO)
    {
        $validPermissions = Permission::whereIn('id', $permissionDTO->permissionIds)
            ->get();
        $validPermissionsArray = $validPermissions->toArray();
        
        if (!count($validPermissionsArray)) {
            throw new PermissionException("Sorry! all permissions provided do not exist.", 422);
        }
        
        if (
            count($permissionDTO->permissionIds) !=
            count($validPermissionsArray)
        ) {
            $invalidPermissionsStr = implode(", ", 
                array_diff(
                    $permissionDTO->permissionIds, 
                    array_map(fn($val) => $val["id"], $validPermissionsArray)
                ));
    
            throw new PermissionException(
                "Sorry! Permissions with [{$invalidPermissionsStr}] ids are not valid.", 422
            );
        };
    }
}