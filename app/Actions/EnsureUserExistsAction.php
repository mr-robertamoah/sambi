<?php

namespace App\Actions;

use App\Exceptions\UserException;
use MrRobertAmoah\DTO\BaseDTO;

class EnsureUserExistsAction extends Action
{
    public function execute(BaseDTO $dto, string $property = "user")
    {
        if ($dto->$property) return;

        throw new UserException("Sorry, a user is required to perform this action.", 422);
    }
}