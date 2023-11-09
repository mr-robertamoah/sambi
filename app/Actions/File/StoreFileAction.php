<?php 

namespace App\Actions\File;

use App\Actions\Action;
use App\Exceptions\FileException;
use Exception;
use Illuminate\Support\Facades\Storage;
use MrRobertAmoah\DTO\BaseDTO;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class StoreFileAction extends Action
{
    public function execute(
        BaseDTO $dto, 
        string $disk = "public", 
        string $file = "file", 
        string $filePath = "path",
        string $userProperty = "user",
        string $descriptionProperty = "description",
    ): array
    {
        $data = [];

        if (
            is_null($dto->$file) || !($dto->$file instanceof UploadedFile)
        ) return $data;

        $data["name"] = $dto->$file->getClientOriginalName();
        $data["mime"] = $dto->$file->getClientMimeType();
        $data["size"] = $dto->$file->getSize();
        $data["filename"] = $this->hashName($data["name"]);
        $data["disk"] = $disk;
        $data["description"] = property_exists($dto, $descriptionProperty) ? $dto->$descriptionProperty : null;
        $data["user"] = property_exists($dto, $userProperty) ? $dto->$userProperty : null;
        $data["path"] = property_exists($dto, $filePath) ? 
            $dto->$filePath : "";

        try {
            $dto->$file->move(Storage::disk($disk)->path($data["path"]), $data["filename"]);
            return $data;
        } catch (Exception $e) {
            ds($e);
            throw new FileException("Sorry! Failed to upload file with " . $data["name"] . " name.", 422);
        }
    }

    private function hashName(string $name): string
    {
        return md5($name);
    }
}