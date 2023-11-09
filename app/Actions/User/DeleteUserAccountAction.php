<?php

namespace App\Actions\User;

use App\Actions\Action;
use App\DTOs\UserDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\UserException;
use Illuminate\Support\Facades\Auth;

class DeleteUserAccountAction extends Action
{
    public function execute(UserDTO $userDTO) : bool
    {
        // Auth::loginUsingId($userDTO->userAccount->id);

        return $userDTO->userAccount->delete();
    }
}