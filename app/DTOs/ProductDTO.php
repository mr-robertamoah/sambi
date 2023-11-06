<?php

namespace App\DTOs;

use App\Models\File;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use MrRobertAmoah\DTO\BaseDTO;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ProductDTO extends BaseDTO
{
    public ?User $user = null;
    public ?Product $product = null;
    public ?File $file = null;
    public string|int|null $productId = null;
    public string|null $name = null;
    public bool $deleteFile = false;
    public string|null $description = null;
    public string|int|null $sellingPrice = null;
    public UploadedFile|null $uploadedFile = null;
    
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