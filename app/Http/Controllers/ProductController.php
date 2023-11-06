<?php

namespace App\Http\Controllers;

use App\Actions\WebErrorHandlingAction;
use App\DTOs\ProductDTO;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render("Products/Index", [
            "products"=> ProductResource::collection(
                Product::query()->latest()->paginate(10)
            ),
        ]);
    }

    public function create(CreateProductRequest $request)
    {
        try {
            ProductService::make()->createProduct(
                ProductDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "description" => $request->description,
                    "sellingPrice" => $request->selling_price,
                    "uploadedFile" => $request->hasFile("file") ? $request->file("file") : null,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function update(UpdateProductRequest $request)
    {
        try {
            ProductService::make()->updateProduct(
                ProductDTO::new()->fromArray([
                    "user" => $request->user(),
                    "name" => $request->name,
                    "productId" => $request->product,
                    "description" => $request->description,
                    "sellingPrice" => $request->selling_price,
                    "uploadedFile" => $request->hasFile("file") ? $request->file("file") : null,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }

    public function delete(Request $request)
    {
        try {
            ProductService::make()->deleteProduct(
                ProductDTO::new()->fromArray([
                    "user" => $request->user(),
                    "productId" => $request->product,
                ])
            );

            return Redirect::back();
        } catch (\Throwable $th) {
            //throw $th;
            return WebErrorHandlingAction::make()->execute($th);
        }
    }
}
