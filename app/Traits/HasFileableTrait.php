<?php

namespace App\Traits;

use App\Models\File;

trait HasFileableTrait
{
    use EnumTrait;

    public function files()
    {
        return $this->morphToMany(File::class,"fileable", "fileables");
    }

    public function image()
    {
        return $this->files()->first();
    }

    public function hasFile()
    {
        return $this->files()->count() > 0;
    }
}