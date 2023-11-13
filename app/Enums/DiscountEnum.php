<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum DiscountEnum: string
{
    use EnumTrait;

    case FIXED = "fixed";
    case PERCENT = "percent";
}