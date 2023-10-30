<?php

namespace App\Traits;

use App\Models\Activity;

trait HasActivityItemableTrait
{
    public function activities()
    {
        return $this->morphMany(Activity::class, "itemable");
    }
}