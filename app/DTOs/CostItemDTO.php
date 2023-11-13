<?php

namespace App\DTOs;

use App\Models\CostItem;
use App\Models\User;
use Illuminate\Http\Request;
use MrRobertAmoah\DTO\BaseDTO;

class CostItemDTO extends BaseDTO
{
    public ?User $user = null;
    public ?CostItem $costItem = null;
    public string|int|null $costItemId = null;
    public string|int|null $categoryId = null;
    public string|null $name = null;
    public string|null $description = null;
    public string|null $unit = null;
    public string|null $unitCharge = null;
    
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
}