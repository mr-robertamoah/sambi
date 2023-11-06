<?php

namespace App\Actions\File;

use App\Actions\Action;
use App\Exceptions\UserException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use MrRobertAmoah\DTO\BaseDTO;

class DeleteFileAction extends Action
{
    public function execute(Model $fileable, string $type = "all")
    {
        if ($type == "all")
        {
            $fileable->files->each(function($file) {
                Storage::disk($file->disk)->delete($file->path . "/" . $file->filename);
                $file->delete();
            });

            return;
        }

        $file = $fileable->files()->first();

        if (!$file) return;
        
        Storage::disk($file->disk)->delete($file->path . "/" . $file->filename);
        $file->delete();
    }
}