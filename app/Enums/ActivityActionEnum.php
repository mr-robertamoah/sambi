<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum ActivityActionEnum: string
{
    use EnumTrait;
    
    case CREATED = "created";
    case DELETED = "deleted";
    case UPDATED = "updated";
    case ASSIGED = "assiged";
    case SYNCED = "synced";
}