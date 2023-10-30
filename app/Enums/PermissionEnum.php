<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum PermissionEnum: string
{
    use EnumTrait;
    
    case manageUser = "manage user";
    case manageCategory = "manage category";
    case manageCost = "manage cost";
    case manageSale = "manage sale";
    case manageProduction = "manage production";
    case manageCostItem = "manage cost item";
    case manageProduct = "manage product";
    case manageAll = "manage all";
    case assignPermission = "assign permission";
}