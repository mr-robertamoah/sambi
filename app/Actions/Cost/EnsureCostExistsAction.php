<?php

namespace App\Actions\Cost;

use App\Actions\Action;
use App\DTOs\CostDTO;
use App\Exceptions\CostException;

class EnsureCostExistsAction extends Action
{
    public function execute(CostDTO $costDTO)
    {
        if ($costDTO->cost) return;

        throw new CostException("Sorry, a cost is required to perform this action.", 422);
    }
}