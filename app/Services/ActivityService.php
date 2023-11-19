<?php

namespace App\Services;

use App\Actions\Activity\CreateActivityAction;
use App\Actions\Activity\EnsureItemableExistsAction;
use App\Actions\EnsureUserExistsAction;
use App\DTOs\ActivityDTO;
use App\Models\Activity;

class ActivityService extends BaseService
{
    public function createActivity(ActivityDTO $activityDTO) : Activity
    {
        EnsureUserExistsAction::make()->execute($activityDTO);

        EnsureItemableExistsAction::make()->execute($activityDTO);

        return CreateActivityAction::make()->execute($activityDTO);
    }
}