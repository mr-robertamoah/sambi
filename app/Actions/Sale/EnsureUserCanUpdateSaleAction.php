<?php

namespace App\Actions\Sale;

use App\Actions\Action;
use App\DTOs\SaleDTO;
use App\Enums\PermissionEnum;
use App\Exceptions\SaleException;

class EnsureUserCanUpdateSaleAction extends Action
{
    public function execute (SaleDTO $saleDTO)
    {
        if (
            $saleDTO->user->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_MANAGE_SALE->value,
            ]) ||
            $saleDTO->user->addedSale($saleDTO->sale)
        ) return;

        throw new SaleException("Sorry, you are not permitted to update sale of {$saleDTO->sale->product->name} product. Alert administrator if you think this is a mistake.", 422);
    }
}