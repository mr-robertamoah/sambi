<?php

namespace App\Http\Resources;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignedUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->pivot["id"],
            "assignee" => new UserResource(User::find($this->pivot["assignee_id"])),
            "assigner" => new UserResource(User::find($this->pivot["assigner_id"])),
            "createdAt" => Carbon::parse($this->pivot["created_at"])->diffForHumans()
        ];
    }
}
