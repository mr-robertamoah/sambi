<?php

namespace App\Actions\File;

use App\Actions\Action;
use MrRobertAmoah\DTO\BaseDTO;

class HasFileAction extends Action
{
    public function execute(BaseDTO $dto, string $property = "file") : bool
    {
        if ($dto->$property) return true;

        return false;
    }
}