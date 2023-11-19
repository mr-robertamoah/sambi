<?php

namespace App\Actions\Activity;

use App\Actions\Action;
use App\DTOs\ActivityDTO;
use App\Models\Activity;

class CreateActivityAction extends Action
{
    public function execute(ActivityDTO $activityDTO) : Activity
    {
        $activity = $activityDTO->user->addedActivities()->create([
            "action" => $activityDTO->action
        ]);

        $activity->itemable()->associate($activityDTO->itemable);
        $activity->save();

        return $activity;
    }
}