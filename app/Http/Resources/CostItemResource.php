<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CostItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "unit" => $this->unit,
            "unitCharge" => $this->unit_charge,
            "user" => new UserResource($this->user),
            "createdAt" => $this->created_at->diffForHumans()
        ];
    }
}
