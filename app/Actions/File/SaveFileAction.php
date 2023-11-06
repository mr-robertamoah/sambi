<?php

namespace App\Actions\File;
use App\Actions\Action;
use App\DTOs\FileDTO;
use Illuminate\Database\Eloquent\Model;

class SaveFileAction extends Action
{
    public function execute(
        FileDTO $fileDTO, 
        bool $attach = false,
        ?Model $fileable = null,
        string $fileableType = "product",
    ) {
        $file = $fileDTO->user->addedFiles()->create([
            "name" => $fileDTO->name,
            "description" => $fileDTO->description,
            "mime" => $fileDTO->mime,
            "size" => $fileDTO->size,
            "path" => $fileDTO->path,
            "filename" => $fileDTO->filename
        ]);

        if ($attach && $fileable) {
            $fileableType .= "Files";
            $file->$fileableType()->attach($fileable);
        }

        return $file;
    }
}