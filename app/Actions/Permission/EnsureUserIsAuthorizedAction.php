<?php

namespace App\Actions\Permission;

use App\Actions\Action;
use App\Actions\EnsureUserIsOfUserTypeAction;
use App\Enums\PermissionEnum;
use App\Exceptions\PermissionException;
use MrRobertAmoah\DTO\BaseDTO;

class EnsureUserIsAuthorizedAction extends Action
{
    public function execute(
        BaseDTO $dto,
        ?string $property = "user",
        ?string $action = null,
    ) {
        if (
            $dto->$property->isPermittedTo(
                name: PermissionEnum::CAN_MANAGE_ALL->value
            ) ||
            ($dto->$property->isPermittedTo(
                name: PermissionEnum::CAN_ASSIGN_PERMISSION->value
            ) && $action == "assign")
        ) return;

        throw new PermissionException("Sorry! You are not permitted to perform this action.", 422);
    }
}