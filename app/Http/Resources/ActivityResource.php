<?php

namespace App\Http\Resources;

use App\Models\Cost;
use App\Models\Permission;
use App\Models\Production;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public ?string $itemName = null;
    public ?string $date = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $itemable = $this->itemable()->withTrashed()->first();

        $this->itemName = strtolower(class_basename($itemable));
        if ($this->itemName == "costitem") $this->itemName = "cost item";
        $this->date = $this->created_at->toDateTimeString();
        
        if ($itemable::class == Permission::class) {
            $description = "assign/unassign permission with name {$this->itemName} to/from a user on {$this->date}.";
        }
        else if ($itemable->name) {
            $description = "{$this->action} {$this->itemName} with name {$this->getName($itemable)} on {$this->date}.";
        }
        else {
            $description = $this->handleOthers($itemable);
        }
        
        return [
            "description" => $description,
        ];
    }

    private function handleOthers($itemable) : string
    {
        $string = "{$this->action} {$this->itemName} data for ";

        if ($itemable::class == Cost::class) {
            $string = $string . "cost item with name {$itemable->costItem->name} ";
        }
        else {
            $string = $string . "product with name {$itemable->product->name} ";
        }

        return $string . "on {$this->date}.";
    }

    private function getName($itemable): string
    {
        
        return match (($itemable)::class) {
            Cost::class => $itemable->costItem->name,
            Cost::class => $itemable->costItem->name,
            default => $itemable->name
        };
    }
}
