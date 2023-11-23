<?php

namespace App\Actions\Activity;

use App\Actions\Action;
use App\DTOs\ActivityDTO;
use App\Enums\PaginationEnum;

class GetUserActivitiesAction extends Action
{
    public function execute(ActivityDTO $activityDTO)
    {
        return $activityDTO->user->addedActivities()
            ->with("itemable")
            ->latest()
            ->take(20)
            ->get();
    }
}