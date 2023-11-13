<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CostResource extends JsonResource
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
            "note" => $this->note,
            "numberOfUnits" => $this->number_of_units,
            "costItem" => new CostItemResource($this->costItem),
            "user" => new UserResource($this->user),
            "date" => $this->date,
            "dateForHumans" => $this->date->rawFormat("M d, Y"),
            "createdAt" => $this->created_at->diffForHumans(),
        ];
    }
}
