<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CostController;
use App\Http\Controllers\CostItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\UserController;
use App\Models\Category;
use App\Models\Product;
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
    ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/stats', StatsController::class)
    ->middleware(['auth', 'verified'])->name('stats');

Route::middleware('auth')->group(function () {
    Route::get('/category/{category}', [CategoryController::class, 'edit'])->name('category.show');
    Route::post('/category/{category}', [CategoryController::class, 'update'])->name('category.update');
    Route::post('/category/{category}/remove', [CategoryController::class, 'remove'])->name('category.remove');
    Route::post('/category', [CategoryController::class, 'create'])->name('category.create');
    Route::get('/category', [CategoryController::class, 'index'])->name('category.index');

    Route::get('/stats', StatsController::class)->name('stats.index');
    
    Route::post('/discount/{discount}', [DiscountController::class, 'update'])->name('discount.update');
    Route::post('/discount/{discount}/remove', [DiscountController::class, 'remove'])->name('discount.remove');
    Route::post('/discount', [DiscountController::class, 'create'])->name('discount.create');
    Route::get('/discount', [DiscountController::class, 'index'])->name('discount.index');
    
    Route::get('/product/{product}', [ProductController::class, 'edit'])->name('product.show');
    Route::post('/product/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::post('/product/{product}/remove', [ProductController::class, 'remove'])->name('product.remove');
    Route::post('/product', [ProductController::class, 'create'])->name('product.create');
    Route::get('/product', [ProductController::class, 'index'])->name('product.index');
    
    Route::get('/cost_item/{cost_item}', [CostItemController::class, 'edit'])->name('cost_item.show');
    Route::post('/cost_item/{cost_item}', [CostItemController::class, 'update'])->name('cost_item.update');
    Route::post('/cost_item/{cost_item}/remove', [CostItemController::class, 'remove'])->name('cost_item.remove');
    Route::post('/cost_item', [CostItemController::class, 'create'])->name('cost_item.create');
    Route::get('/cost_item', [CostItemController::class, 'index'])->name('cost_item.index');

    Route::get('/permission/{permission}', [PermissionController::class, 'edit'])->name('permission.show');
    Route::post('/permission/{permission}', [PermissionController::class, 'update'])->name('permission.update');
    Route::post('/permission/{permission}/remove', [PermissionController::class, 'remove'])->name('permission.remove');
    Route::post('/permission', [PermissionController::class, 'create'])->name('permission.create');
    Route::get('/permission', [PermissionController::class, 'index'])->name('permission.index');
    
    Route::post('/user/{user}/permissions', [PermissionController::class, 'syncPermissions'])->name('user.permissions.update');
    Route::post('/user/{user}/remove', [UserController::class, 'remove'])->name('user.remove');
    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    
    Route::get('/cost/{cost}', [CostController::class, 'edit'])->name('cost.show');
    Route::post('/cost/{cost}', [CostController::class, 'update'])->name('cost.update');
    Route::post('/cost/{cost}/remove', [CostController::class, 'remove'])->name('cost.remove');
    Route::post('/cost', [CostController::class, 'create'])->name('cost.create');
    Route::get('/cost', [CostController::class, 'index'])->name('cost.index');
    
    Route::get('/sale/{sale}', [SaleController::class, 'edit'])->name('sale.show');
    Route::post('/sale/{sale}', [SaleController::class, 'update'])->name('sale.update');
    Route::post('/sale/{sale}/remove', [SaleController::class, 'remove'])->name('sale.remove');
    Route::post('/sale', [SaleController::class, 'create'])->name('sale.create');
    Route::get('/sale', [SaleController::class, 'index'])->name('sale.index');
    
    Route::get('/production/{production}', [ProductionController::class, 'edit'])->name('production.show');
    Route::post('/production/{production}', [ProductionController::class, 'update'])->name('production.update');
    Route::post('/production/{production}/remove', [ProductionController::class, 'remove'])->name('production.remove');
    Route::post('/production', [ProductionController::class, 'create'])->name('production.create');
    Route::get('/production', [ProductionController::class, 'index'])->name('production.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/remove', [ProfileController::class, 'remove'])->name('profile.remove');
});

require __DIR__.'/auth.php';
