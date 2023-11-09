<?php

namespace App\Actions\User;

use App\Actions\Action;
use App\DTOs\UserDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\UserException;
use App\Models\User;

class UpdateUserAction extends Action
{
    public function execute(UserDTO $userDTO) : User
    {
        $data = [
            "name" => $userDTO->name,
            "email" => $userDTO->email,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));
        
        $userDTO->user->fill($data);

        if ($userDTO->user->isDirty('email')) {
            $userDTO->user->email_verified_at = null;
        }

        $userDTO->user->save();

        return $userDTO->user->refresh();
    }
}