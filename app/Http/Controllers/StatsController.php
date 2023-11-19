<?php

namespace App\Http\Controllers;

use App\DTOs\StatsDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Resources\MiniCostItemResource;
use App\Http\Resources\MiniDiscountResource;
use App\Http\Resources\MiniProductResource;
use App\Http\Resources\MiniUserResource;
use App\Http\Resources\ProductionResource;
use App\Models\CostItem;
use App\Models\Discount;
use App\Models\Product;
use App\Models\Production;
use App\Models\Sale;
use App\Models\User;
use App\Services\StatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatsController extends Controller
{
    public function __invoke(Request $request)
    {
        return Inertia::render('Stats/Index', 
            StatService::new()->view(
                StatsDTO::new()->fromArray([
                    "startDate" => $request->date,
                    "user" => $request->user(),
                    "period" => $request->period,
                ])
            )
        );
    }
}
