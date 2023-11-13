<?php

namespace App\Actions\Sale;

use App\Actions\Action;
use App\DTOs\SaleDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\SaleException;

class EnsureUserCanCreateSaleAction extends Action
{
    public function execute (SaleDTO $saleDTO)
    {
        if (
            $saleDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_SALE->value,
            ])
        ) return;

        throw new SaleException("Sorry, you are not permitted to create a sale on this platform. Alert administrator if you think this is a mistake.", 422);
    }
}