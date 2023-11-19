import Creator from '@/Components/Creator';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Select from '@/Components/Select';
import Table from '@/Components/Table';
import ActionButton from '@/Components/ActionButton';
import Badge from '@/Components/Badge';
import getDate from '@/Helpers/getDate';
import addCurrency from '@/Helpers/addCurrency';
import dayjs from "dayjs"
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, CategoryScale } from 'chart.js';

ChartJS.register(CategoryScale, ...registerables);

export default function Index({
    auth, production, sales, costs,
    filtered, filteredData
}) {
    
    let productionTableDiv = useRef(null)
    let salesTableDiv = useRef(null)
    let costsTableDiv = useRef(null)
    let [filterBy, setFilterBy] = useState("")
    let [refresh, setRefresh] = useState(false)
    let [data, setData] = useState({
        period: '',
        date: "",
    });
    let [productionData, setProductionData] = useState({
        highestQuantity: '',
        lowestQuantity: '',
        lowestStock: '',
        highestStock: '',
        stock: "",
        dataType: "quantity",
        chartType: "bar",
        sChartData: {
            title: "Stock of Products added for the filtered period",
            labels: [],
            datasets: []
        },
        qChartData: {
            title: "Quantity of Products produced for the filtered period",
            labels: [],
            datasets: []
        }
    });
    let [costData, setCostData] = useState({
        highestNOU: '',
        lowestNOU: '',
        lowestCost: '',
        highestCost: '',
        lowestCategoryCost: '',
        highestCategoryCost: '',
        totalCost: "",
        dataType: "number",
        chartType: "bar",
        nouChartData: {
            title: "Number of units of each cost item bought during period",
            labels: [],
            datasets: []
        },
        taChartData: {
            title: "Total cost incurred for each cost item during period",
            labels: [],
            datasets: []
        }
    });
    let [salesData, setSalesData] = useState({
        highestNOU: '',
        lowestNOU: '',
        lowestDA: '',
        highestDA: '',
        lowestTA: '',
        highestTA: '',
        totalDiscountedSale: "",
        totalSale: "",
        totalDiscount: "",
        dataType: "number",
        chartType: "bar",
        daChartData: {
            title: "Discounted Sale of Products during filtered period",
            labels: [],
            datasets: []
        },
        taChartData: {
            title: "Total Sale (without discount) of Products during filtered period",
            labels: [],
            datasets: []
        },
        nouChartData: {
            title: "Number of units sold for Products during filtered period",
            labels: [],
            datasets: []
        }
    });

    let filters = [
        {query: "daily", text: "daily period", moment: "day"},
        {query: "weekly", text: "weekly period", moment: "week"}, 
        {query: "monthly", text: "monthly period", moment: "month"}, 
        {query: "yearly", text: "yearly period", moment: "year"},
    ]

    useEffect(function () {
        let hQuantity  = 0, lQuantity = 0, quantity
        let lStock = 0, hStock = 0, stock, totalStock = 0
        let hqProduct, lqProduct, lsProduct, hsProduct
        let qChartData = {
            datasets: [
            {id: 1, label: "Quantities produced in period", data: []},
        ], labels: []}
        let sChartData = {
            datasets: [
            {id: 2, label: "Stocks of products for period", data: []}, 
        ], labels: []}
        
        if (production.length) {
            quantity = parseInt(production[0].quantity)
            lStock = quantity * production[0].sellingPrice
            lQuantity = quantity
        }

        production.forEach((prod) => {
            quantity = parseInt(prod.quantity)
            stock = quantity * prod.sellingPrice

            qChartData.datasets[0].data.push(quantity)
            sChartData.datasets[0].data.push(stock)
            qChartData.labels.push(prod.name)
            sChartData.labels.push(prod.name)

            totalStock += stock

            if (hQuantity <= quantity) {
                hQuantity = quantity
                hqProduct = prod.name
            }
            
            if (lQuantity >= quantity) {
                lQuantity = quantity
                lqProduct = prod.name
            }
            
            if (hStock <= stock) {
                hStock = stock
                hsProduct = prod.name
            }

            if (lStock >= stock) {
                lStock = stock
                lsProduct = prod.name
            }
        })
       
        setProductionData((prev) => {
            return {
                ...prev,
                stock: addCurrency(totalStock), 
                highestQuantity: `${hqProduct} (${hQuantity} quantity)`,
                lowestQuantity: `${lqProduct} (${lQuantity} quantity)`,
                highestStock: `${hsProduct} (${addCurrency(hStock)})`,
                lowestStock: `${lsProduct} (${addCurrency(lStock)})`,
                qChartData,
                sChartData,
            }
        })
       
    }, [production])

    useEffect(function () {
        let hNOU  = 0, lNOU = 0, numberOfUnits
        let lDA = 0, hDA = 0, lTA = 0, hTA = 0, sale, totalDA = 0, totalTA = 0, totalDiscount = 0, discountedSale
        let hnouProduct, lnouProduct, ldaProduct, hdaProduct, ltaProduct, htaProduct
        let nouChartData = {
            datasets: [
            {id: 1, label: "Number of units of products sold during period", data: []},
        ], labels: []}
        let daChartData = {
            datasets: [
            {id: 2, label: "Discounted total sale of products during period", data: []}, 
        ], labels: []}
        let taChartData = {
            datasets: [
            {id: 2, label: "Total sale (without discount) of products during period", data: []}, 
        ], labels: []}
        
        if (sales.length) {
            lTA = sales[0].total
            lDA = sales[0].discountedTotal
            lNOU = parseInt(sales[0].numberOfUnits)
        }

        sales.forEach((prod) => {
            numberOfUnits = parseInt(prod.numberOfUnits)
            sale = prod.total
            discountedSale = prod.discountedTotal

            nouChartData.datasets[0].data.push(numberOfUnits)
            daChartData.datasets[0].data.push(discountedSale)
            taChartData.datasets[0].data.push(sale)
            nouChartData.labels.push(prod.name)
            daChartData.labels.push(prod.name)
            taChartData.labels.push(prod.name)

            totalDA += discountedSale
            totalTA += sale
            totalDiscount += prod.totalDiscount

            if (hNOU <= numberOfUnits) {
                hNOU = numberOfUnits
                hnouProduct = prod.name
            }
            
            if (lNOU >= numberOfUnits) {
                lNOU = numberOfUnits
                lnouProduct = prod.name
            }
            
            if (hDA <= discountedSale) {
                hDA = discountedSale
                hdaProduct = prod.name
            }

            if (lDA >= discountedSale) {
                lDA = discountedSale
                ldaProduct = prod.name
            }
            
            if (hTA <= sale) {
                hTA = sale
                htaProduct = prod.name
            }

            if (lTA >= sale) {
                lTA = sale
                ltaProduct = prod.name
            }
        })
       
        lTA = lTA.toFixed(2)
        hTA = hTA.toFixed(2)
        hDA = hDA.toFixed(2)
        lDA = lDA.toFixed(2)
        totalDA = totalDA.toFixed(2)
        totalTA = totalTA.toFixed(2)
        totalDiscount = totalDiscount.toFixed(2)
        setSalesData((prev) => {
            return {
                ...prev,
                highestNOU: `${hnouProduct} (${hNOU} quantity)`,
                lowestNOU: `${lnouProduct} (${lNOU} quantity)`,
                highestTA: `${htaProduct} (${addCurrency(hTA)})`,
                lowestTA: `${ltaProduct} (${addCurrency(lTA)})`,
                highestDA: `${hdaProduct} (${addCurrency(hDA)})`,
                lowestDA: `${ldaProduct} (${addCurrency(lDA)})`,
                daChartData,
                taChartData,
                nouChartData,
                totalDiscountedSale: totalDA,
                totalSale: addCurrency(totalTA),
                totalDiscount: addCurrency(totalDiscount)
            }
        })
       
    }, [sales])

    useEffect(function () {
        let hNOU  = 0, lNOU = 0, numberOfUnits
        let hTA = 0, lTA = 0, cost, totalTA = 0
        let hnouProduct, lnouProduct, ltaProduct, htaProduct, index
        let nouChartData = {
            datasets: [
            {id: 1, label: "Number of units of cost items bought during period", data: []},
        ], labels: []}
        let taChartData = {
            datasets: [
            {id: 2, label: "Total cost incurred for each cost item during period", data: []}, 
        ], labels: []}
        let categories = []
        
        if (costs.length) {
            lTA = parseInt(costs[0].total)
            lNOU = parseInt(costs[0].numberOfUnits)
        }

        costs.forEach((prod) => {
            numberOfUnits = parseInt(prod.numberOfUnits)
            cost = parseInt(prod.total)

            nouChartData.datasets[0].data.push(numberOfUnits)
            taChartData.datasets[0].data.push(cost)
            nouChartData.labels.push(prod.name)
            taChartData.labels.push(prod.name)

            totalTA += cost

            index = categories.findIndex(c => c.name == prod.categoryName)
            if (index != -1) {
                categories[index] = {...categories[index], cost: cost + categories[index].cost}
            }
            else categories.push({cost, name: prod.categoryName})

            if (hNOU <= numberOfUnits) {
                hNOU = numberOfUnits
                hnouProduct = prod.name
            }
            
            if (lNOU >= numberOfUnits) {
                lNOU = numberOfUnits
                lnouProduct = prod.name
            }
            
            if (hTA <= cost) {
                hTA = cost
                htaProduct = prod.name
            }

            if (lTA >= cost) {
                lTA = cost
                ltaProduct = prod.name
            }
        })
       
        lTA = lTA.toFixed(2)
        hTA = hTA.toFixed(2)
        totalTA = totalTA.toFixed(2)

        let highestCategory = categories.reduce((final, cat) => final > cat.cost ? final : cat.cost, 0)
        let lowestCategory = categories.reduce((final, cat) => final < cat.cost ? final : cat.cost, highestCategory.cost)

        highestCategory = highestCategory ?? 0
        lowestCategory = lowestCategory ?? 0
        setCostData((prev) => {
            return {
                ...prev,
                highestNOU: `${hnouProduct} (${hNOU} quantity)`,
                lowestNOU: `${lnouProduct} (${lNOU} quantity)`,
                highestCost: `${htaProduct} (${addCurrency(hTA)})`,
                lowestCost: `${ltaProduct} (${addCurrency(lTA)})`,
                taChartData,
                nouChartData,
                totalCost: totalTA,
                highestCategoryCost: `${categories.find(cat => cat.cost == highestCategory)?.name ?? ""} (${addCurrency(highestCategory)})`,
                lowestCategoryCost: `${categories.find(cat => cat.cost == lowestCategory)?.name ?? ""} (${addCurrency(lowestCategory)})`,
            }
        })
       
    }, [sales])

    useEffect(function () {
        
        if (filtered) setRefresh(false)
    }, [filtered])

    useEffect(() => {
        if (!filteredData) return

        let date = "", period = ""
        
        if (filteredData["date"]) {
            date = getDate(filteredData["date"])
        }
        if (filteredData["period"]) {
            period = filteredData["period"]
            setFilterBy(filteredData["period"])
        }

        setData((prev) => {
            return {period, date}
        })
    }, [filteredData])

    function addPeriod() {
        let date = dayjs(data.date)
            .add(1, filters.find(f => f.query == filterBy).moment)
            .format("YYYY-MM-DD")

        setData((prev) => {
            return {...prev, date}
        })
    }

    function subPeriod() {
        let date = dayjs(data.date)
            .subtract(1, filters.find(f => f.query == filterBy).moment)
            .format("YYYY-MM-DD")

        setData((prev) => {
            return {...prev, date}
        })
    }

    function getStats() {
        router.get(route("stats.index") + 
            `?date=${data.date}&period=${data.period}`, {
            onSuccess: (res) => {
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Statistics</h2>}
        >
            <Head title="Statistics"/>

            <div className="flex justify-between items-start font-bold my-4 p-2 max-w-3xl mx-auto">
                <div className='text-green-800 text-sm mr-4'>{addCurrency((salesData.totalDiscountedSale - costData.totalCost).toFixed(2))} profit made for this period</div>
                <div className="text-left">
                    <div className="text-sm text-gray-600">{production.length} production entr{production.length == 1 ? "y" : "ies"}</div>
                    <div className="text-sm text-gray-600">{sales.length} sale entr{sales.length == 1 ? "y" : "ies"}</div>
                    <div className="text-sm text-gray-600">{costs.length} cost entr{costs.length == 1 ? "y" : "ies"}</div>
                </div>
            </div>

            <div className="my-4 p-2 max-w-3xl mx-auto bg-white rounded">
                
                {(filtered && !refresh) && <div className="w-full flex justify-start items-center my-2">
                    <div className="text-sm capitalize text-start shrink-0">filters: </div>
                    <div className="w-full flex justify-start items-center font-normal">
                        {data.date && <Badge className='mx-2 text-gray-600 bg-slate-200 p-1 text-sm lowercase' onClose={() => {
                            setData({
                                date: "", period: ""
                            })
                            getStats()
                        }}>filter started on {data.date} and for a {data.period} period</Badge>}
                    </div>
                </div>}
                <div className="w-full flex justify-start items-center text-sm text-gray-600 font-normal">
                    <Select
                        value={filterBy}
                        placeholder="select period to filter by"
                        optionKey="text"
                        valueKey="query"
                        options={filters}
                        className="mt-1 max-w-[200px] mr-2 p-1"
                        onChange={(e) => {
                            setData((prev) => {
                                return {...prev, period: e.target.value}
                            })
                            if (data.date) setRefresh(true)
                            setFilterBy(e.target.value)
                        }}
                    />
                    {filterBy?.length ? <TextInput
                        type="date"
                        placeholder={"select start date"}
                        className="mt-1 max-w-[200px] mr-2 p-1"
                        value={data.date}
                        onChange={(e) => {
                            setData((prev) => {
                                return {...prev, date: e.target.value}
                            })
                            setRefresh(true)
                        }}
                    /> : ""}
                    {refresh && <ActionButton
                        className='mt-1 max-w-[200px] mr-2 p-1'
                        onClick={getStats}
                        >filter</ActionButton>}
                    {filtered && 
                        <div className='ml-4 flex items-center'>
                            <div
                                className='select-none mt-1 max-w-[200px] mr-2 p-2 text-gray-600 font-semibold cursor-pointer'
                                title="set the previous date"
                                onClick={() => {
                                    subPeriod()
                                    setRefresh(true)
                                }}
                            >{"<<"}</div>
                            <div
                                className='select-none mt-1 max-w-[200px] mr-2 p-2 text-gray-600 font-semibold cursor-pointer'
                                title="set the next date"
                                onClick={() => {
                                    addPeriod()
                                    setRefresh(true)
                                }}
                            >{">>"}</div>
                        </div>
                    }
                </div>
            </div>

            <div className='border-b-2 border-gray-600 pb-4 mb-6'>
                <div ref={productionTableDiv} className={`px-6 mb-12 my-4 w-full max-w-[800px] mx-auto block overflow-x-auto max-h-[500px] overflow-y-auto`}>
                    <Table
                        cols={["product name", "selling price", "quantity"]}
                        heading={"Production"}
                        data={production}
                        strips={true}
                        scrollable={productionTableDiv}
                        hasAddedBy={false}
                        rowDataKeys={[
                            "name", 
                            "sellingPrice", 
                            "quantity",
                        ]}
                    ></Table>
                </div>
                {production.length ? <>
                    <div className='text-sm w-full text-center text-gray-600 mt-4 font-semibold mb-2'>Production Stats</div>
                    <table className='m-auto p-2 text-sm'>
                        <tbody>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 shrink-0 capitalize'>Total stock added</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{productionData.stock}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 shrink-0 capitalize'>Product with highest production quantity</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{productionData.highestQuantity}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 shrink-0 capitalize'>Product with lowest production quantity</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{productionData.lowestQuantity}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 shrink-0 capitalize'>Product with highest production stock</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{productionData.highestStock}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 shrink-0 capitalize'>Product with lowest production stock</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{productionData.lowestStock}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='text-sm w-full text-center text-gray-600 mt-4 font-semibold mb-2'>Production Chart</div>
                    <div className='mx-3 w-full sm:w-[90%] sm:mx-auto max-w-[600px]'>
                        <div className='w-ful flex justify-end mb-4'>
                            <Select
                                value={productionData.chartType}
                                placeholder="select chart type"
                                optionKey="text"
                                valueKey="text"
                                options={[
                                    {text: "bar"}, 
                                    {text: "line"}, 
                                    {text: "pie"},
                                ]}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                onChange={(e) => {
                                    setProductionData(prev => {
                                        return {...prev, chartType: e.target.value}
                                    })
                                }}
                            />
                            
                            <Select
                                value={productionData.dataType}
                                placeholder="select data to use"
                                optionKey="text"
                                valueKey="text"
                                options={[
                                    {text: "quantity"}, 
                                    {text: "stock"}, 
                                ]}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                onChange={(e) => {
                                    setProductionData(prev => {
                                        return {...prev, dataType: e.target.value}
                                    })
                                }}
                            />
                        </div>
                        <Chart
                            type={productionData.chartType}
                            title={productionData.dataType == "quantity" ? productionData.qChartData.title : productionData.sChartData.title}
                            data={productionData.dataType == "quantity" ? productionData.qChartData : productionData.sChartData}
                        ></Chart>
                    </div>
                </> : <div className='text-sm text-gray-600 flex w-full h-10 justify-center items-center'>no chart or stats</div>}
            </div>

            <div className='border-b-2 border-gray-600 pb-4 mb-6'>
                <div ref={salesTableDiv} className={`px-6 mb-12 my-4 w-full max-w-[800px] mx-auto block overflow-x-auto max-h-[500px] overflow-y-auto`}>
                    <Table
                        cols={["product", "selling price", "number of units", "total sale", "total discount",  "discounted total"]}
                        heading={"Sales"}
                        data={sales}
                        strips={true}
                        hasAddedBy={false}
                        scrollable={salesTableDiv}
                        rowDataKeys={[
                            "name", 
                            (item) => `GHȻ ${item.sellingPrice}`, 
                            "numberOfUnits",
                            (item) => addCurrency(item.total.toFixed(2)), 
                            (item) => addCurrency(item.totalDiscount.toFixed(2)), 
                            (item) => addCurrency(item.discountedTotal.toFixed(2)), 
                        ]}
                    ></Table>
                </div>
                {sales.length ? <>
                    <div className='text-sm w-full text-center text-gray-600 mt-4 font-semibold mb-2'>Sales Stats</div>
                    <table className='m-auto p-2 text-sm'>
                        <tbody>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Total discounted sale</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{addCurrency(salesData.totalDiscountedSale)}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Total sale</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.totalSale}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Total discounts</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.totalDiscount}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Product with highest sale in terms of number of units sold</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.highestNOU}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Product with lowest sale in terms of number of units sold</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.lowestNOU}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Product with highest sale in terms of discounted amount</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.highestDA}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Product with lowest sale in terms of discounted amount</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.lowestDA}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Product with highest sale (without discount)</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.highestTA}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Product with lowest sale (without discount)</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{salesData.lowestTA}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='text-sm w-full text-center text-gray-600 mt-4 font-semibold mb-2'>Sale Chart</div>
                    <div className='mx-3 w-full sm:w-[90%] sm:mx-auto max-w-[600px]'>
                        <div className='w-ful flex justify-end mb-4'>
                            <Select
                                value={salesData.chartType}
                                placeholder="select chart type"
                                optionKey="text"
                                valueKey="text"
                                options={[
                                    {text: "bar"}, 
                                    {text: "line"}, 
                                    {text: "pie"},
                                ]}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                onChange={(e) => {
                                    setSalesData(prev => {
                                        return {...prev, chartType: e.target.value}
                                    })
                                }}
                            />
                            
                            <Select
                                value={salesData.dataType}
                                placeholder="select data to use"
                                optionKey="text"
                                valueKey="query"
                                options={[
                                    {query: "number", text: "number of units"}, 
                                    {query: "discount", text: "total discounted sale"}, 
                                    {query: "total", text: "total sale (without discount)"}, 
                                ]}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                onChange={(e) => {
                                    setSalesData(prev => {
                                        return {...prev, dataType: e.target.value}
                                    })
                                }}
                            />
                        </div>
                        <Chart
                            type={salesData.chartType}
                            data={salesData.dataType == "number" ? salesData.nouChartData : (salesData.dataType == "total" ? salesData.taChartData : salesData.daChartData)}
                        ></Chart>
                    </div>
                </> : <div className='text-sm text-gray-600 flex w-full h-10 justify-center items-center'>no chart or stats</div>}
            </div>

            <div className='border-b-2 border-gray-600 pb-4 mb-6'>
                <div ref={costsTableDiv} className={`px-6 mb-12 my-4 w-full max-w-[800px] mx-auto block overflow-x-auto max-h-[500px] overflow-y-auto`}>
                    <Table
                        cols={["cost item", "category", "price per unit", "unit", "number of units", "total cost"]}
                        heading={"Costs"}
                        data={costs}
                        strips={true}
                        hasAddedBy={false}
                        scrollable={costsTableDiv}
                        rowDataKeys={[
                            "name", 
                            "categoryName", 
                            (item) => `GHȻ ${item.unitCharge}`,
                            "unit", 
                            "numberOfUnits",
                            (item) => `GHȻ ${item.total}`,
                        ]}
                    ></Table>
                </div>
                {costs.length ? <>
                    <div className='text-sm w-full text-center text-gray-600 mt-4 font-semibold mb-2'>Cost Stats</div>
                    <table className='m-auto p-2 text-sm'>
                        <tbody>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Total Cost for period</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{addCurrency(costData.totalCost)}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Cost item with highest number of units bought</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{costData.highestNOU}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Cost item with lowest number of units bought</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{costData.lowestNOU}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Cost category with highest incurred cost</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{costData.highestCategoryCost}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Cost category with lowest incurred cost</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{costData.lowestCategoryCost}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Cost item with highest incurred cost</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{costData.highestCost}</td>
                            </tr>
                            <tr className='w-full flex items-center min-w-[400px] max-w-[600px] mb-2'>
                                <td className='mr-2 bg-slate-400 p-2 text-gray-100 capitalize'>Cost item with lowest incurred cost</td>
                                <td className='bg-slate-600 text-slate-50 w-full p-2 text-center'>{costData.lowestCost}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='text-sm w-full text-center text-gray-600 mt-4 font-semibold mb-2'>Cost Chart</div>
                    <div className='mx-3 w-full sm:w-[90%] sm:mx-auto max-w-[600px]'>
                        <div className='w-ful flex justify-end mb-4'>
                            <Select
                                value={costData.chartType}
                                placeholder="select chart type"
                                optionKey="text"
                                valueKey="text"
                                options={[
                                    {text: "bar"}, 
                                    {text: "line"}, 
                                    {text: "pie"},
                                ]}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                onChange={(e) => {
                                    setCostData(prev => {
                                        return {...prev, chartType: e.target.value}
                                    })
                                }}
                            />
                            
                            <Select
                                value={costData.dataType}
                                placeholder="select data to use"
                                optionKey="text"
                                valueKey="query"
                                options={[
                                    {query: "number", text: "number of units"}, 
                                    {query: "total", text: "total cost incurred"}, 
                                ]}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                onChange={(e) => {
                                    setCostData(prev => {
                                        return {...prev, dataType: e.target.value}
                                    })
                                }}
                            />
                        </div>
                        <Chart
                            type={costData.chartType}
                            data={costData.dataType == "number" ? costData.nouChartData : costData.taChartData}
                        ></Chart>
                    </div>
                </> : <div className='text-sm text-gray-600 flex w-full h-10 justify-center items-center'>no chart or stats</div>}
            </div>

            <Creator className="mt-3"></Creator>
        </AuthenticatedLayout>
    );
}