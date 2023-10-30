<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CostController;
use App\Http\Controllers\CostItemController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/category/{category}', [CategoryController::class, 'edit'])->name('category.show');
    Route::post('/category/{category}', [CategoryController::class, 'edit'])->name('category.edit');
    Route::patch('/category/{category}', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('/category/{category}', [CategoryController::class, 'destroy'])->name('category.destroy');
    Route::post('/category', [CategoryController::class, 'create'])->name('category.create');
    Route::get('/category', [CategoryController::class, 'index'])->name('category.index');
    
    Route::get('/product/{product}', [ProductController::class, 'edit'])->name('product.show');
    Route::post('/product/{product}', [ProductController::class, 'edit'])->name('product.edit');
    Route::patch('/product/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/product/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::post('/product', [ProductController::class, 'create'])->name('product.create');
    Route::get('/product', [ProductController::class, 'index'])->name('product.index');
    
    Route::get('/cost_item/{cost_item}', [CostItemController::class, 'edit'])->name('cost_item.show');
    Route::post('/cost_item/{cost_item}', [CostItemController::class, 'edit'])->name('cost_item.edit');
    Route::patch('/cost_item/{cost_item}', [CostItemController::class, 'update'])->name('cost_item.update');
    Route::delete('/cost_item/{cost_item}', [CostItemController::class, 'destroy'])->name('cost_item.destroy');
    Route::post('/cost_item', [CostItemController::class, 'create'])->name('cost_item.create');
    Route::get('/cost_item', [CostItemController::class, 'index'])->name('cost_item.index');
    
    Route::get('/cost/{cost}', [CostController::class, 'edit'])->name('cost.show');
    Route::post('/cost/{cost}', [CostController::class, 'edit'])->name('cost.edit');
    Route::patch('/cost/{cost}', [CostController::class, 'update'])->name('cost.update');
    Route::delete('/cost/{cost}', [CostController::class, 'destroy'])->name('cost.destroy');
    Route::post('/cost', [CostController::class, 'create'])->name('cost.create');
    Route::get('/cost', [CostController::class, 'index'])->name('cost.index');
    
    Route::get('/sale/{sale}', [SaleController::class, 'edit'])->name('sale.show');
    Route::post('/sale/{sale}', [SaleController::class, 'edit'])->name('sale.edit');
    Route::patch('/sale/{sale}', [SaleController::class, 'update'])->name('sale.update');
    Route::delete('/sale/{sale}', [SaleController::class, 'destroy'])->name('sale.destroy');
    Route::post('/sale', [SaleController::class, 'create'])->name('sale.create');
    Route::get('/sale', [SaleController::class, 'index'])->name('sale.index');
    
    Route::get('/production/{production}', [ProductionController::class, 'edit'])->name('production.show');
    Route::post('/production/{production}', [ProductionController::class, 'edit'])->name('production.edit');
    Route::patch('/production/{production}', [ProductionController::class, 'update'])->name('production.update');
    Route::delete('/production/{production}', [ProductionController::class, 'destroy'])->name('production.destroy');
    Route::post('/production', [ProductionController::class, 'create'])->name('production.create');
    Route::get('/production', [ProductionController::class, 'index'])->name('production.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
