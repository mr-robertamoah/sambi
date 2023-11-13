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
                PermissionEnum::CAN_MANAGE_COST->value,
            ]) ||
            $saleDTO->user->addedSale($saleDTO->sale)
        ) return;

        $tag = $saleDTO->sale->tag ? $saleDTO->sale->tag . " " : "";
        throw new SaleException("Sorry, you are not permitted to update {$tag}sale. Alert administrator if you think this is a mistake.", 422);
    }
}