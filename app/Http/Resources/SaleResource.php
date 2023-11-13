<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
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
            "buyerName" => $this->buyer_name,
            "numberOfUnits" => $this->number_of_units,
            "product" => new MiniProductResource($this->product),
            "discount" => new MiniDiscountResource($this->discount),
            "user" => new UserResource($this->user),
            "date" => $this->date,
            "dateForHumans" => $this->date->rawFormat("M d, Y"),
            "createdAt" => $this->created_at->diffForHumans(),
        ];
    }
}
