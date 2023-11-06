<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum PaginationEnum: int
{
    use EnumTrait;
    
    case GET_SMALL = 5;
    case GET_MANY = 10;
}