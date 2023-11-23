<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(["middleware"=> "auth:sanctum"], function () {

    Route::get('/permission/{permission}/detail', [PermissionController::class, 'detail'])->name('permission.detail');
    Route::get('/permission_activity', [PermissionController::class, 'getUserDetails'])
        ->name('user.details');
    
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
