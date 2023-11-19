<?php

namespace App\Actions\Activity;

use App\Actions\Action;
use App\DTOs\ActivityDTO;
use App\Exceptions\ActivityException;

class EnsureItemableExistsAction extends Action
{
    public function execute(ActivityDTO $activityDTO): void
    {
        if ($activityDTO->itemable) return;

        throw new ActivityException("Sorry, there is no entity (cost, sale, product, etc) associated with the activity.", 422);
    }
}