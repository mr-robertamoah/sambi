<?php

namespace App\DTOs;

use App\Models\Cost;
use App\Models\CostItem;
use App\Models\User;
use Illuminate\Http\Request;
use MrRobertAmoah\DTO\BaseDTO;

class CostDTO extends BaseDTO
{
    public ?User $user = null;
    public ?CostItem $costItem = null;
    public ?Cost $cost = null;
    public string|int|null $costItemId = null;
    public string|int|null $costId = null;
    public string|null $date = null;
    public string|null $note = null;
    public string|null $numberOfUnits = null;
    
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