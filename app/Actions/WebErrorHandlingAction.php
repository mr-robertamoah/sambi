<?php

namespace App\Actions;

use Illuminate\Support\Facades\Redirect;
use Throwable;

class WebErrorHandlingAction extends Action
{
    public function execute(Throwable $throwable)
    {
        ds($throwable);
        $message = $throwable->getMessage();

        if ($throwable->getCode() < 200) $message = "Something unfortunate happened here. Please try again shortly.";

        return Redirect::back()->withErrors(["failed" => $message]);
    }
}