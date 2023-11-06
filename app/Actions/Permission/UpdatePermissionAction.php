<?php

namespace App\Actions\Permission;
use App\Actions\Action;
use App\DTOs\PermissionDTO;
use App\Models\Permission;

class UpdatePermissionAction extends Action
{
    public function execute(PermissionDTO $permissionDTO) : Permission
    {
        $data = [
            'name' => $permissionDTO->name,
            'description' => $permissionDTO->description,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));
        
        $permissionDTO->permission->update($data);

        return $permissionDTO->permission->refresh();
    }
}