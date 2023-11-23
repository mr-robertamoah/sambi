<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\UserDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $users = [];
        $wantsJson = $request->wantsJson();
        $permitted = $user?->isPermittedTo(names: [
            PermissionEnum::CAN_MANAGE_ALL->value,
            PermissionEnum::CAN_MANAGE_USER->value,
            PermissionEnum::CAN_VIEW_USER->value,
            PermissionEnum::CAN_ASSIGN_PERMISSION->value,
        ]);

        if (!$permitted && $wantsJson) return response()->json(["users" => $users]);
        if (!$permitted && !$wantsJson) return Inertia::render('Users/Index', [
            "users" => $users,
        ]);
        
        $users = User::query()
                ->whereNot("id", $user->id);

        if (!$request->added_cost && $user->isNotPermittedTo(name: PermissionEnum::CAN_MANAGE_ALL->value))
            $users->whereCannotManageAll();

        if ($request->added_cost) $users->whereAddedCost();

        if ($request->name) $users->where("name", "LIKE", "%{$request->name}%");

        if ($wantsJson) return response()->json((["users" => UserResource::collection(
            $users->get()
        )]));

        return Inertia::render('Users/Index', [
            "users" => UserResource::collection($users->paginate(PaginationEnum::GET_MANY->value)),
        ]);
    }

    public function remove(Request $request)
    {
        try {
            UserService::make()->deleteUser(
                UserDTO::new()->fromArray([
                    "user" => $request->user(),
                    "userAccountId" => $request->user,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
