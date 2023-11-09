<?php

namespace App\Actions\User;

use App\Actions\Action;
use App\DTOs\UserDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\UserException;

class EnsureUserCanDeleteAnotherUserAccountAction extends Action
{
    public function execute(UserDTO $userDTO)
    {
        if (
            $userDTO->user->isPermittedTo(
                names: [
                    PermissionEnum::CAN_MANAGE_ALL->value,
                    PermissionEnum::CAN_MANAGE_USER->value,
                ]
            )
        ) return;

        throw new UserException("Sorry! You are not authorized to delete the account of another user.", 422);
    }
}