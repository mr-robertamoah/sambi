<?php

namespace App\DTOs;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use MrRobertAmoah\DTO\BaseDTO;

class PermissionDTO extends BaseDTO
{
    public ?User $user = null;
    public ?Permission $permission = null;
    public ?User $assignee = null;
    public ?string $name = null;
    public ?string $like = null;
    public ?string $description = null;
    public ?string $permissionId = null;
    public array $permissionIds = [];
    public int|string|null $page = null;
    public int|string|null $assigneeId = null;

    public function isForNextPage() : bool
    {
        return !is_null($this->page);
    }
    
    /**
     * assign data (filled or validated) to the dto properties as an 
     * addition to the fromRequest function.
     *
     * @param  Illuminate\Http\Request  $request
     * @return MrRobertAmoah\DTO\BaseDTO
     */
    protected function fromRequestExtension(Request $request) : self
    {
        return $this;
    }

    /**
     * assign values of keys of an array to the corresponding dto properties 
     * as an additional function for the fromData function.
     *
     * @param  array  $data
     * @return MrRobertAmoah\DTO\BaseDTO
     */
    protected function fromArrayExtension(array $data = []) : self
    {
        return $this;
    }

    /**
    * uncomment and use this function if you want to 
    * customize the key and value pairs
    * to be used to create your dto and still get the 
    * other features of the dto
    */
//    public function requestToArray($request)
//    {
//       return [];
//    }
}