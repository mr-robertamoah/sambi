<?php

namespace App\Services;

use App\Actions\EnsureUserExistsAction;
use App\Actions\Permission\EnsureValidGetDataAction;
use App\Actions\Permission\EnsurePermissionsWhereGivenAction;
use App\Actions\Permission\EnsureUserIsAuthorizedAction;
use App\Actions\GetModelFromDTOAction;
use App\Actions\Permission\CreatePermissionAction;
use App\Actions\Permission\DeletePermissionAction;
use App\Actions\Permission\EnsurePermissionExistsAction;
use App\Actions\Permission\EnsurePermissionsExistAction;
use App\Actions\Permission\EnsureValidDataExistsAction;
use App\Actions\Permission\GetPermissionsAction;
use App\Actions\Permission\SyncPermissionsAndUserAction;
use App\Actions\Permission\UpdatePermissionAction;
use App\DTOs\PermissionDTO;
use App\Models\Permission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PermissionService extends BaseService
{
    public function createPermission(PermissionDTO $permissionDTO) : Permission
    {
        EnsureUserExistsAction::make()->execute($permissionDTO);

        EnsureUserIsAuthorizedAction::make()->execute($permissionDTO);

        EnsureValidDataExistsAction::make()->execute($permissionDTO);

        return CreatePermissionAction::make()->execute($permissionDTO);
    }

    public function updatePermission(PermissionDTO $permissionDTO)
    {

        EnsureUserExistsAction::make()->execute($permissionDTO);

        $permissionDTO = $permissionDTO->withPermission(
            GetModelFromDTOAction::make()->execute(
                $permissionDTO, "permission", "permission"
            )
        );

        EnsurePermissionExistsAction::make()->execute($permissionDTO);

        EnsureUserIsAuthorizedAction::make()->execute($permissionDTO);

        EnsureValidDataExistsAction::make()->execute($permissionDTO, true);

        return UpdatePermissionAction::make()->execute($permissionDTO);
    }
    
    public function deletePermission(PermissionDTO $permissionDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($permissionDTO);

        $permissionDTO = $permissionDTO->withPermission(
            GetModelFromDTOAction::make()->execute(
                $permissionDTO, "permission", "permission"
            )
        );

        EnsurePermissionExistsAction::make()->execute($permissionDTO);

        EnsureUserIsAuthorizedAction::make()->execute($permissionDTO);

        return DeletePermissionAction::make()->execute($permissionDTO);
    }
    
    public function getPermissions(PermissionDTO $permissionDTO) : LengthAwarePaginator
    {
        EnsureUserExistsAction::make()->execute($permissionDTO);
        
        EnsureValidGetDataAction::make()->execute($permissionDTO);

        return GetPermissionsAction::make()->execute($permissionDTO);
    }
    
    public function syncPermissionsAndUser(PermissionDTO $permissionDTO)
    {
        EnsureUserExistsAction::make()->execute($permissionDTO);

        EnsurePermissionsWhereGivenAction::make()->execute($permissionDTO);

        EnsurePermissionsExistAction::make()->execute($permissionDTO);

        EnsureUserIsAuthorizedAction::make()->execute($permissionDTO, action: "assign");

        return SyncPermissionsAndUserAction::make()->execute($permissionDTO);
    } 
}