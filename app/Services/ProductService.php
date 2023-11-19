<?php

namespace App\Services;

use App\Actions\Product\EnsureProductExistsAction;
use App\Actions\EnsureUserExistsAction;
use App\Actions\File\DeleteFileAction;
use App\Actions\File\HasFileAction;
use App\Actions\File\SaveFileAction;
use App\Actions\Product\CreateProductAction;
use App\Actions\Product\DeleteProductAction;
use App\Actions\Product\UpdateProductAction;
use App\Actions\File\StoreFileAction;
use App\Actions\GetModelFromDTOAction;
use App\DTOs\FileDTO;
use App\DTOs\ProductDTO;
use App\Models\Product;
use App\Actions\Product\EnsureUserCanCreateProductAction;
use App\Actions\Product\EnsureUserCanUpdateProductAction;
use App\DTOs\ActivityDTO;
use App\Enums\ActivityActionEnum;

class ProductService extends BaseService
{
    public function createProduct(ProductDTO $productDTO): Product
    {
        EnsureUserExistsAction::make()->execute($productDTO);

        EnsureUserCanCreateProductAction::make()->execute($productDTO);

        $hasFile = HasFileAction::make()->execute($productDTO, "uploadedFile");

        if ($hasFile)
            $fileDTO = FileDTO::new()->fromArray(
                StoreFileAction::make()->execute(
                    dto: $productDTO, 
                    file: "uploadedFile")
            );

        $product = CreateProductAction::make()->execute($productDTO);

        if ($hasFile)
            SaveFileAction::make()->execute(
                fileDTO: $fileDTO, fileable: $product
            );

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $productDTO->user,
                "itemable" => $product,
                "action" => ActivityActionEnum::CREATED->value
            ])
        );
        
        return $product;
    }

    public function updateProduct(ProductDTO $productDTO)
    {
        EnsureUserExistsAction::make()->execute($productDTO);

        $productDTO = $productDTO->withProduct(
            GetModelFromDTOAction::make()->execute(
                $productDTO, "product", "product"
            )
        );

        EnsureProductExistsAction::make()->execute($productDTO);

        EnsureUserCanUpdateProductAction::make()->execute($productDTO);

        $hasFile = HasFileAction::make()->execute($productDTO, "uploadedFile");

        if ($hasFile || ($productDTO->deleteFile && $productDTO->product->hasFile()))
            DeleteFileAction::make()->execute(fileable: $productDTO->product);

        if ($hasFile) {
            $fileDTO = FileDTO::new()->fromArray(
                StoreFileAction::make()->execute(
                    dto: $productDTO, 
                    file: "uploadedFile")
            );

            SaveFileAction::make()->execute(
                fileDTO: $fileDTO, fileable: $productDTO->product
            );
        } 

        $product = UpdateProductAction::make()->execute($productDTO);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $productDTO->user,
                "itemable" => $product,
                "action" => ActivityActionEnum::UPDATED->value
            ])
        );
        
        return $product;
    }

    public function deleteProduct(ProductDTO $productDTO) : bool
    {
        EnsureUserExistsAction::make()->execute($productDTO);

        $productDTO = $productDTO->withProduct(
            GetModelFromDTOAction::make()->execute(
                $productDTO, "product", "product"
            )
        );

        EnsureProductExistsAction::make()->execute($productDTO);

        EnsureUserCanUpdateProductAction::make()->execute($productDTO);

        DeleteFileAction::make()->execute(fileable: $productDTO->product);

        ActivityService::new()->createActivity(
            ActivityDTO::new()->fromArray([
                "user" => $productDTO->user,
                "itemable" => $productDTO->product,
                "action" => ActivityActionEnum::DELETED->value
            ])
        );

        return DeleteProductAction::make()->execute($productDTO);
    }
}