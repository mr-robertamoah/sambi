<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MiniPermissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "assignedBy" => User::find($this->pivot["assigner_id"])->name,
            "assignedOn" => $this->pivot["created_at"]->diffForHumans(),
        ];
    }
}
