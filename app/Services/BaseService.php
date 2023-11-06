<?php

namespace App\Services;

use App\Exceptions\BaseServiceException;
use App\Exceptions\ServiceException;
use Illuminate\Support\Str;

class BaseService
{
    public static function make(): static
    {
        return new static;
    }

    public static function new(): static
    {
        return new static;
    }

    public static function __callStatic($name, $arguments)
    {
        if (method_exists($class = static::class, $name)) {
            return (new static)->$name(...$arguments);
        }

        throw new BaseServiceException("{$name} method does not exist in the {$class} class");
    }

    public static function getFileStorageName(string $name, string $extenstion) : string
    {
        return Str::camel($name) . '-' . now()->timestamp . ".{$extenstion}";
    }
}