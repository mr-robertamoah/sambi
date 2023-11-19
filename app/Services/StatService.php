<?php

namespace App\Services;

use App\Actions\EnsureUserExistsAction;
use App\DTOs\StatsDTO;
use App\Enums\PaginationEnum;
use App\Enums\PermissionEnum;
use App\Http\Resources\CostResource;
use App\Http\Resources\MiniProductResource;
use App\Http\Resources\MiniUserResource;
use App\Http\Resources\ProductionResource;
use App\Http\Resources\SaleResource;
use App\Models\Cost;
use App\Models\Product;
use App\Models\Production;
use App\Models\Sale;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatService extends BaseService
{
    public function view(StatsDTO $statsDTO)
    {
        EnsureUserExistsAction::make()->execute($statsDTO);

        $permitted = $statsDTO->user->isPermittedTo(names: [
            PermissionEnum::CAN_MANAGE_ALL->value,
            PermissionEnum::CAN_VIEW_STATS->value,
        ]);

        if (! $permitted) return [];
        
        $filtered = false;

        $statsDTO = $this->setDates($statsDTO);

        if ($statsDTO->startDate && $statsDTO->endDate) $filtered = true;

        return [
            "production" => $this->queryProduction($statsDTO, Production::query())
                ->select(
                    DB::raw("count(*) as count"),
                    "products.name",
                    "products.selling_price as sellingPrice", 
                    DB::raw("sum(quantity) as quantity")
                )->join("products", "productions.product_id", "=", "products.id")
                ->groupBy(["products.name", "products.selling_price"])
                ->orderBy("quantity", "desc")
                ->get(),
            "costs" => $this->queryCost($statsDTO, Cost::query())
                ->join("cost_items", "cost_items.id", "=", "costs.cost_item_id")
                ->join("categories", "cost_items.category_id", "=", "categories.id")
                ->selectRaw(
                    "COUNT(*) as count,
                    cost_items.name,
                    cost_items.unit_charge as unitCharge,
                    categories.name as categoryName,
                    cost_items.unit,
                    SUM(costs.number_of_units) as numberOfUnits,
                    SUM(costs.number_of_units * cost_items.unit_charge) as total"
                )
                ->groupBy(["cost_items.name", "cost_items.unit", "cost_items.unit_charge", "costs.number_of_units", "categories.name"])
                ->orderBy("total", "desc")
                ->get(),
            "sales" => DB::table('products')
                ->select('products.name', 'products.selling_price as sellingPrice')
                ->addSelect(DB::raw('SUM(sales.number_of_units) as numberOfUnits'))
                ->addSelect(DB::raw('SUM(sales.number_of_units * products.selling_price) as total'))
                ->addSelect(DB::raw('
                    SUM(
                        CASE
                            WHEN discounts.type = "percent" THEN 
                                ((sales.number_of_units * products.selling_price) * (discounts.amount / 100))
                            WHEN discounts.type = "fixed" THEN 
                                discounts.amount
                            ELSE 
                                0
                        END
                    ) as totalDiscount
                '))
                ->leftJoin('sales', 'products.id', '=', 'sales.product_id')
                ->leftJoin('discounts', 'sales.discount_id', '=', 'discounts.id')
                ->whereBetween(DB::raw('DATE(sales.date)'), [$statsDTO->startDate, $statsDTO->endDate])
                ->groupBy('products.name', 'products.selling_price')
                ->get()->map(function($product, $key) {
                    $product->discountedTotal = $product->total - $product->totalDiscount;
                    return $product;
                }),
            "filtered" => $filtered,
            "filteredData" => array_map(fn ($value) => $value == "null" ? null : $value, [
                "date" => $statsDTO->startDate,
                "period" => $statsDTO->period,
            ])
        ];
    }

    private function queryProduction(StatsDTO $statsDTO, $query)
    {
        if ($statsDTO->startDate && $statsDTO->endDate)
            $query->whereBetweenDates($statsDTO->startDate, $statsDTO->endDate);

        return $query;
    }

    private function queryCost(StatsDTO $statsDTO, $query)
    {
        if ($statsDTO->startDate && $statsDTO->endDate)
            $query->whereBetweenDates($statsDTO->startDate, $statsDTO->endDate);

        return $query;
    }

    private function querySale(StatsDTO $statsDTO, $query)
    {
        if ($statsDTO->startDate && $statsDTO->endDate)
            $query->whereBetweenDates($statsDTO->startDate, $statsDTO->endDate);

        return $query;
    }

    public function setDates(StatsDTO $statsDTO)
    {
        if (!$statsDTO->startDate) {
            $statsDTO = $statsDTO->withStartDate(
                now()->subMonths(1)->toDateTimeString()
            );

            $statsDTO = $statsDTO->withPeriod("monthly");
        }

        $carbonStartDate = Carbon::parse($statsDTO->startDate);
        $statsDTO = $statsDTO->withEndDate(match ($statsDTO->period) {
            "daily" => $carbonStartDate->addDay()->toDateTimeString(),
            "weekly" => $carbonStartDate->addWeek()->toDateTimeString(),
            "monthly" => $carbonStartDate->addMonth()->toDateTimeString(),
            "yearly" => $carbonStartDate->addYear()->toDateTimeString(),
            default => null,
        });

        return $statsDTO;
    }
}