<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum ActivityActionEnum: string
{
    use EnumTrait;
    
    case created = "CREATED";
    case deleted = "DELETED";
    case updated = "UPDATED";
}