<?php

namespace App\Services;

use App\Actions\EnsureUserExistsAction;
use App\Actions\File\DeleteFileAction;
use App\Actions\File\HasFileAction;
use App\Actions\File\SaveFileAction;
use App\Actions\File\StoreFileAction;
use App\Actions\GetModelFromDTOAction;
use App\Actions\User\DeleteUserAccountAction;
use App\Actions\User\EnsureUserCanDeleteAnotherUserAccountAction;
use App\Actions\User\UpdateUserAction;
use App\DTOs\FileDTO;
use App\DTOs\UserDTO;

class UserService extends BaseService
{
    public function updateUser(UserDTO $userDTO)
    {
        EnsureUserExistsAction::make()->execute($userDTO);

        $hasFile = HasFileAction::make()->execute($userDTO, "image");

        if ($hasFile || $userDTO->deleteImage)
            DeleteFileAction::make()->execute(fileable: $userDTO->user);

        if ($hasFile) {
            $fileDTO = FileDTO::new()->fromArray(
                StoreFileAction::make()->execute(
                    dto: $userDTO, 
                    file: "image")
            );

            SaveFileAction::make()->execute(
                fileDTO: $fileDTO, fileable: $userDTO->user, fileableType: "user"
            );
        } 

        return UpdateUserAction::make()->execute($userDTO);
    }

    public function deleteUser(UserDTO $userDTO)
    {
        EnsureUserExistsAction::make()->execute($userDTO);

        $userDTO = $userDTO->withUserAccount(
            GetModelFromDTOAction::make()->execute(
                $userDTO, "userAccount"
            )
        );

        EnsureUserExistsAction::make()->execute($userDTO, "userAccount");

        EnsureUserCanDeleteAnotherUserAccountAction::make()->execute($userDTO);

        return DeleteUserAccountAction::make()->execute($userDTO);
    }
}