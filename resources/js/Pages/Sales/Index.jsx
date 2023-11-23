import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextBox from '@/Components/TextBox';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Select from '@/Components/Select';
import Table from '@/Components/Table';
import ActionButton from '@/Components/ActionButton';
import Badge from '@/Components/Badge';
import getDate from '@/Helpers/getDate';
import getDiscountText from '@/Helpers/getDiscountText';
import calculateByDiscount from '@/Helpers/calculateByDiscount';
import addCurrency from '@/Helpers/addCurrency';
import can from '@/Helpers/can';

export default function Index({ auth, sales, users, products, discounts, filtered, filteredData }) {

    let tableDiv = useRef(null)
    let [filterBy, setFilterBy] = useState("")
    let [refresh, setRefresh] = useState(false)
    let [buyers, setBuyers] = useState([])
    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("create")
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        discount_id: '',
        number_of_units: '',
        date: "",
        note: "",
        buyer_name: "",
        user_id: "",
        date_start: "",
        date_end: "",
    });
    let newData = {
        id: '',
        name: '',
        note: '',
        buyerName: '',
        numberOfUnits: "",
        productId: '',
        discountId: '',
        date: '',
    }
    let filters = [
        {query: "user_id", text: "person who added"}, 
        {query: "buyer_name", text: "person who bought"}, 
        {query: "product_id", text: "product"}, 
        {query: "discount_id", text: "discount"}, 
        {query: "dates", text: "date between"},
        {query: "date", text: "date on"},
    ]
    let [filterData, setFilterData] = useState({});
    let [modalData, setModalData] = useState(newData);

    useEffect(() => {
        setBuyers([...(
            sales.data?.map(sale => sale.buyerName)
        )])
    }, [])

    useEffect(function () {
        if (!openModal) {
            reset()
            clearErrors()
            setModalData(newData)
        }

        if (success && openModal) setSuccess(null)
        if (errors.failed && openModal) errors.failed = null
        
    }, [openModal])

    useEffect(function () {

        if (filterBy == "user_id") setFilterData(users.data?.map(user => {
            return {key: user.name, value: user.id}
        }))
        if (filterBy == "product_id") setFilterData(products.data?.map(product => {
            return {key: product.name, value: product.id}
        }))
        if (filterBy == "discount_id") setFilterData(discounts.data?.map(discount => {
            return {key: discount.name, value: discount.id}
        }))
        if (filterBy == "buyer_name") setFilterData(buyers.map(buyer => {
            return {value: buyer}
        }))
    }, [filterBy])

    useEffect(() => {
        if (!filteredData) return

        if (filteredData["product_id"]) {
            setFilterBy("product_id")
            setRefresh(true)
            data.product_id = filteredData["product_id"]
        }
        if (filteredData["discount_id"]) {
            setFilterBy("discount_id")
            setRefresh(true)
            data.discount_id = filteredData["discount_id"]
        }
        if (filteredData["buyer_name"]) {
            setFilterBy("buyer_name")
            setRefresh(true)
            data.buyer_name = filteredData["buyer_name"]
        }
        if (filteredData["user_id"]) {
            setFilterBy("user_id")
            setRefresh(true)
            data.user_id = filteredData["user_id"]
        }
        if (filteredData["date"]) {
            setFilterBy("date")
            setRefresh(true)
            data.date = filteredData["date"]
        }
        if (filteredData["date_start"] && filteredData["date_end"]) {
            setFilterBy("dates")
            setRefresh(true)
            data.date_start = filteredData["date_start"]
            data.date_end = filteredData["date_end"]
        }
    }, [filteredData])

    function toggleModal() {
        setOpenModal(!openModal)
    }

    function newSale() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function updateModalData(sale) {
        setModalData((prev) => {
            return {
                id: sale.id, 
                name: sale.product.name,
                numberOfUnits: sale.numberOfUnits, 
                note: sale.note ?? "", 
                buyerName: sale.buyerName ?? "", 
                date: getDate(sale.date),
                productId: sale.product.id,
                discountId: sale.discount?.id,
            }
        })
    }

    function editSale(sale) {
        setAction("edit")
        updateModalData(sale)
        setOpenModal(true)
    }

    function removeSale(sale) {
        setAction("delete")
        updateModalData(sale)
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createSale()
        }

        updateSale()
    }

    function updateData(key, value) {
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value

            if (key == "numberOfUnits") setData("number_of_units", value)
            else if (key == "productId") setData("product_id", value)
            else if (key == "discountId") setData("discount_id", value)
            else if (key == "buyerName") setData("buyer_name", value)
            else if (["note", "date"].includes(key)) setData(key, value)
            return d
        })
    }

    function createSale() {
        post(route("sale.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Sale item has been successfully created.")
            }
        })
    }

    function updateSale() {
        post(route("sale.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} sale item has been successfully updated.`)
            }
        })
    }

    function deleteSale() {
        post(route("sale.remove", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} sale item has been successfully deleted.`)
            }
        })
    }

    function getSales() {
        router.get(route("sale.index") + 
            `?user_id=${
                data.user_id
            }&product_id=${
                data.product_id
            }&discount_id=${
                data.discount_id
            }&buyer_name=${
                data.buyer_name
            }&date_start=${
                data.date_start
            }&date_end=${
                data.date_end
            }&date=${
                data.date
            }`, {
            onSuccess: (res) => {
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales</h2>}
        >
            <Head title="Sales" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{sales.meta?.total} sale entr{sales.meta?.total == 1 ? "y" : "ies"}</div>
                {can(auth.user?.data, "create", "sales") && (products.data?.length ? <PrimaryButton onClick={newSale}>new</PrimaryButton> :
                    <Link
                        href={route('cost_item.index')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        go to products to create at least one
                    </Link>
                )}
            </div>

            <div ref={tableDiv} className={`px-6 py-12 w-full block overflow-x-auto`}>
                
                <Table
                    cols={["buyer name", "product", "selling price", "number of units", "discount",  "total sale", "date of transaction", "added", "actions"]}
                    heading={"sales made"}
                    data={sales.data}
                    links={sales.links}
                    strips={true}
                    rowIdx={[2, 4, 5]}
                    scrollable={tableDiv}
                    rowClassName={`text-green-800 font-semibold`}
                    rowDataKeys={[
                        "buyerName", 
                        "product.name", 
                        (item) => `GHȻ ${item.product.sellingPrice}`, 
                        "numberOfUnits",
                        (item) => item.discount ? getDiscountText(item.discount) : "no discount",
                        (item) => addCurrency(calculateByDiscount(item.numberOfUnits * item.product.sellingPrice, item.discount).toFixed(2)), 
                        "dateForHumans"
                    ]}
                    actions={[
                        {func: (item) => editSale(item), disabled: (item) => processing, className: "bg-blue-600", text: "edit"},
                        {func: (item) => removeSale(item), disabled: (item) => processing, className: "bg-red-600 hover:bg-red-500 active:bg-red-700 focus:bg-red-500 focus:ring-red-500", text: "delete"}
                    ]}
                    disableActions={item => !can(auth.user?.data, "update", "sales", item.user)}
                >
                    {filtered && <div className="w-full flex justify-start items-center my-2">
                        <div className="text-sm capitalize text-start shrink-0">filters: </div>
                        <div className="w-full flex justify-start items-center font-normal">
                            {data.buyer_name && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.buyer_name = ""
                                getSales()
                            }}>filtered by {buyers.find(u => u == data.buyer_name)} buyer</Badge>}
                            {data.product_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.product_id = ""
                                getSales()
                            }}>filtered by {products.data?.find(u => u.id == data.product_id).name} product</Badge>}
                            {data.discount_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.discount_id = ""
                                getSales()
                            }}>filtered by {discounts.data?.find(u => u.id == data.discount_id).name} discount</Badge>}
                            {data.date && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.date = ""
                                getSales()
                            }}>filtered using {getDate(data.date)} date</Badge>}
                            {data.date_end && data.date_start && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.date_start = ""
                                data.date_end = ""
                                getSales()
                            }}>filtered using dates between {data.date_start} and {data.date_end}</Badge>}
                            {data.user_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.user_id = ""
                                getSales()
                            }}>filtered by {users.data?.find(u => u.id == data.user_id).name}</Badge>}
                        </div>
                    </div>}
                    <div className="w-full flex justify-start items-center text-sm text-gray-600 font-normal">
                        <Select
                            value={filterBy}
                            placeholder="select something to filter sales by"
                            optionKey="text"
                            valueKey="query"
                            options={filters}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            onChange={(e) => {
                                setFilterBy(e.target.value)}
                            }
                        />
                        {["user_id", "product_id", "discount_id"].includes(filterBy) && <Select
                            type="text"
                            value={filterBy == "user_id" ? data.user_id : data.product_id}
                            placeholder={`filter by ${filters.find(f => f.query == filterBy)?.text}`}
                            optionKey="key"
                            valueKey="value"
                            options={filterData}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            onChange={(e) => {
                                setData(filterBy, e.target.value)
                                data[filterBy] = e.target.value
                                if (filtered) getSales()
                                if (e.target.value) setRefresh(true)
                            }}
                        />}
                        {"buyer_name" == filterBy && <TextInput
                            type="text"
                            placeholder={"name of buyer"}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            value={data.buyer_name}
                            onChange={(e) => {
                                setData("buyer_name", e.target.value)
                                data.buyer_name = e.target.value
                                if (data.buyer_name) setRefresh(true)
                            }}
                        />}
                        {"date" == filterBy && <TextInput
                            type="date"
                            placeholder={"select date"}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            value={data.date}
                            onChange={(e) => {
                                data.date = e.target.value
                                if (filtered) getSales()
                                setRefresh(true)
                            }}
                        />}
                        {"dates" == filterBy && 
                        <>
                            <TextInput
                                type="date"
                                placeholder={"select start date"}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                value={data.date_start}
                                onChange={(e) => {
                                    setData("date_start", e.target.value)
                                    data.date_start = e.target.value
                                    if (data.date_start && data.date_end && filtered) getSales()
                                    if (data.date_end) setRefresh(true)
                                }}
                            />
                            <TextInput
                                type="date"
                                placeholder={"select end date"}
                                className="mt-1 max-w-[200px] mr-2 p-1"
                                value={data.date_end}
                                onChange={(e) => {
                                    setData("date_end", e.target.value)
                                    data.date_end = e.target.value
                                    if (data.date_start && data.date_end && filtered) getSales()
                                    if (data.date_start) setRefresh(true)
                                }}
                            />
                        </>}
                        {refresh && <ActionButton
                            className='mt-1 max-w-[200px] mr-2 p-1'
                            onClick={getSales}
                            >filter</ActionButton>}
                        {(filtered || (data.product_id || data.user_id || data.date || (data.date_end && data.date_start))) && <ActionButton
                            className='mt-1 max-w-[200px] mr-2 p-1'
                            onClick={() => {
                                data.product_id = ""
                                data.date = ""
                                data.user_id = ""
                                data.date_end = ""
                                data.date_start = ""
                                data.buyer_name = ""
                                getSales()
                            }}
                            >clear filter</ActionButton>}
                    </div>
                </Table>
            </div>

            <Creator className="mt-3"></Creator>

            <Modal
                show={openModal}
                onClose={toggleModal}
            >
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Sale </div>
                <Alert
                    show={errors.failed || success}
                    type={success ? "success" : "failed"}
                    onDisappear={() => {
                        if (action == "delete" && !modalData.id) setOpenModal(false)
                    }}
                >{success ?? errors.failed}</Alert>
                {processing && (<div className={`w-full text-center flex rounded-full mt-4 mb-2 justify-center items-center ${action != "delete" ? "text-green-600" : "text-red-600"}`}>
                    <div className={`mr-2 animate-ping w-3 h-3 ${action != "delete" ? "bg-green-400" : "bg-red-400"}`}></div> {action == "create" ? "creating" : action == "edit" ? "editing" : "deleting"}...
                </div>)}
                {action != "delete" && (<form encType="multipart/form-data" className="mx-auto p-2 max-w-md" onSubmit={submit}>

                    <div>
                        <InputLabel htmlFor="buyer_name" value="Buyer name" />

                        <TextInput
                            id="buyer_name"
                            type="text"
                            name="buyer_name"
                            value={modalData.buyerName}
                            isFocused={true}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("buyer_name")
                                updateData('buyerName', e.target.value)}}
                        />

                        <InputError message={errors.buyer_name} className="mt-2" />
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="product" value="Product" />

                        <Select
                            id="product"
                            type="text"
                            name="product"
                            value={modalData.productId}
                            placeholder="select product"
                            optionKey="name"
                            valueKey="id"
                            options={products.data}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("product_id")
                                updateData('productId', e.target.value)
                            }}
                        />

                        <InputError message={errors.product_id} className="mt-2" />
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="discount" value="Discount" />

                        <Select
                            id="discount"
                            type="text"
                            name="discount"
                            value={modalData.discountId}
                            placeholder="select discount"
                            optionKey="name"
                            valueKey="id"
                            options={discounts.data}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("discount_id")
                                updateData('discountId', e.target.value)
                            }}
                        />

                        <InputError message={errors.discount_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="date" value="Date" />

                        <TextInput
                            id="date"
                            type="date"
                            name="date"
                            value={modalData.date}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("date")
                                updateData('date', e.target.value)}}
                        />

                        <InputError message={errors.date} className="mt-2" />
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="number_of_units" value="Number of Units" />

                        <TextInput
                            id="number_of_units"
                            name="number_of_units"
                            type="number"
                            value={modalData.numberOfUnits}
                            className="mt-1 block w-full"
                            placeholder="0"
                            onChange={(e) => {
                                clearErrors("number_of_units")
                                updateData('numberOfUnits', e.target.value)
                            }}
                        />

                        <InputError message={errors.number_of_units} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="note" value="Note" />

                        <TextBox
                            id="note"
                            name="note"
                            value={modalData.note}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("note")
                                updateData('note', e.target.value)}}
                        />

                        <InputError message={errors.note} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        
                        <PrimaryButton className="ml-4 mb-4" 
                            disabled={processing || (action == "edit" && !(!!data.discount_id || !!data.date || !!data.product_id || !!data.number_of_units || !!data.note || !!data.buyer_name))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete sale associated with <span className="capitalize font-semibold">{modalData.name}</span> product</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deleteSale}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}