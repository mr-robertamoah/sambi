<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum PermissionEnum: string
{
    use EnumTrait;
    
    case CAN_MANAGE_USER = "can manage user";
    case CAN_MANAGE_CATEGORY = "can manage category";
    case CAN_MANAGE_COST = "can manage cost";
    case CAN_MAKE_COST_ENTRY = "can make cost entry";
    case CAN_MANAGE_SALE = "can manage sale";
    case CAN_MAKE_SALE_ENTRY = "can make sale entry";
    case CAN_MANAGE_PRODUCTION = "can manage production";
    case CAN_MAKE_PRODUCTION_ENTRY = "can make production entry";
    case CAN_MANAGE_COST_ITEM = "can manage cost item";
    case CAN_MAKE_COST_ITEM_ENTRY = "can make cost item entry";
    case CAN_MANAGE_PRODUCT = "can manage product";
    case CAN_MANAGE_ALL = "can manage all";
    case CAN_ASSIGN_PERMISSION = "can assign permission";
    case CAN_VIEW_STATS = "can view stats";
}