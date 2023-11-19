<?php

namespace App\Http\Controllers;

use App\Actions\ApiErrorHandlingAction;
use App\Actions\WebErrorHandlingAction;
use App\DTOs\PermissionDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\CreatePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\AssignedUserResource;
use App\Http\Resources\PermissionDetailResource;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Permissions/Index', [
            "permissions" => $request->user()?->isPermittedTo(names: [
                PermissionEnum::CAN_MANAGE_ALL->value,
                PermissionEnum::CAN_ASSIGN_PERMISSION->value,
            ]) ?
                PermissionResource::collection(
                    Permission::all()
                ) : [],
        ]);
    }

    public function create(CreatePermissionRequest $request)
    {
        try {
            PermissionService::new()->createPermission(
                PermissionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description
                ])
            );

            return Redirect::back()->with("success","Permission have been successfully created.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdatePermissionRequest $request)
    {
        try {
            PermissionService::new()->updatePermission(
                PermissionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description,
                    "permissionId" => $request->permission,
                ])
            );

            return Redirect::back()->with("success","Permission have been successfully updated.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function delete(Request $request)
    {
        try {
            PermissionService::new()->deletePermission(
                PermissionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "permissionId" => $request->permission,
                ])
            );

            return Redirect::back()->with("success","Permission have been successfully deleted.");
        } catch (\Throwable $th) {
            //throw $th;
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
    
    public function detail(Request $request)
    {
        try {
            return response()->json([
                "detail" => new PermissionDetailResource(
                        Permission::find($request->permission)
                    )
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            return ApiErrorHandlingAction::make()->execute($th);
        }
    }

    public function getPermissions(Request $request)
    {
        try {
            return response()->json([
                "permissions" => PermissionService::new()->getPermissions(
                    PermissionDTO::new()->fromArray([
                        "user" => $request->user(),
                        "like" => $request->like,
                        "assigneeId" => $request->assignee_id,
                    ])
                )
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            return ApiErrorHandlingAction::make()->execute($th);
        }
    }

    public function syncPermissions(Request $request)
    {
        $wantsJson =  $request->wantsJson();
        try {
            PermissionService::new()->syncPermissionsAndUser(
                PermissionDTO::new()->fromArray([
                    "user" => $request->user(),
                    "assignee" => $assignee = User::find($request->assignee_id),
                    "permissionIds" => $request->permission_ids
                ])
            );
            
            if ($wantsJson) {
                $permissionAssigned = $assignee->refresh()
                    ->assignedPermissions()
                    ->wherePivotIn("permission_id", $request->permission_ids)
                    ->latest()->first();
                            
                return response()->json([
                    "success" => "Permissions have been successfully synced.",
                    "assigned" => $permissionAssigned ? new AssignedUserResource($permissionAssigned) : null
                ]);
            }

            return Redirect::back()->with("success","Permissions have been successfully synced.");
        } catch (\Throwable $th) {
            //throw $th;

            if ($wantsJson) return ApiErrorHandlingAction::make()->execute($th);
            
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
