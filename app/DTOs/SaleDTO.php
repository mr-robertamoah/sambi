<?php

namespace App\DTOs;

use App\Models\Discount;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use MrRobertAmoah\DTO\BaseDTO;

class SaleDTO extends BaseDTO
{
    public ?User $user = null;
    public ?Sale $sale = null;
    public ?Product $product = null;
    public string|int|null $productId = null;
    public ?Discount $discount = null;
    public string|int|null $discountId = null;
    public string|int|null $saleId = null;
    public string|int|null $numberOfUnits = null;
    public string|null $date = null;
    public string|null $note = null;
    public string|null $buyerName = null;
   
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