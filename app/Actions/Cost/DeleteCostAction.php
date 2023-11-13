<?php

namespace App\Actions\Cost;

use App\Actions\Action;
use App\DTOs\CostDTO;

class DeleteCostAction extends Action
{
    public function execute(CostDTO $costDTO)
    {
        return $costDTO->cost->delete();
    }
}