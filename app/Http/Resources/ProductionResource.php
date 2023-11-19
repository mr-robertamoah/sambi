<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionResource extends JsonResource
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
            "quantity" => $this->quantity,
            "product" => new MiniProductResource($this->product),
            "user" => new UserResource($this->user),
            "note" => $this->note,
            "date" => $this->date,
            "dateForHumans" => $this->date->rawFormat("M d, Y"),
            "createdAt" => $this->created_at->diffForHumans(),
        ];
    }
}
