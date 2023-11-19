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
import can from '@/Helpers/can';

export default function Index({ auth, production, users, products, filtered, filteredData }) {

    let tableDiv = useRef(null)
    let [filterBy, setFilterBy] = useState("")
    let [refresh, setRefresh] = useState(false)
    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("create")
    const { data, setData, post, processing, errors, reset, clearErrors, delete: routerDelete } = useForm({
        product_id: '',
        quantity: '',
        date: "",
        note: "",
        user_id: "",
        date_start: "",
        date_end: "",
    });
    let newData = {
        id: '',
        name: '',
        note: '',
        quantity: "",
        productId: '',
        date: '',
    }
    let filters = [
        {query: "user_id", text: "person who added"}, 
        {query: "product_id", text: "product"}, 
        {query: "dates", text: "date between"},
        {query: "date", text: "date on"},
    ]
    let [filterData, setFilterData] = useState({});
    let [modalData, setModalData] = useState(newData);

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
    }, [filterBy])

    useEffect(() => {
        if (!filteredData) return

        if (filteredData["product_id"]) {
            setFilterBy("product_id")
            setRefresh(true)
            data.product_id = filteredData["product_id"]
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

    function newProduction() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function updateModalData(production) {
        setModalData((prev) => {
            return {
                id: production.id, 
                name: production.product.name,
                quantity: production.quantity, 
                note: production.note ?? "", 
                date: getDate(production.date),
                productId: production.product.id,
            }
        })
    }

    function editProduction(production) {
        setAction("edit")
        updateModalData(production)
        setOpenModal(true)
    }

    function removeProduction(production) {
        setAction("delete")
        updateModalData(production)
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createProduction()
        }

        updateProduction()
    }

    function updateData(key, value) {
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value

            if (key == "productId") setData("product_id", value)
            else if (["note", "date", "quantity"].includes(key)) setData(key, value)
            return d
        })
    }

    function createProduction() {
        post(route("production.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Production item has been successfully created.")
            }
        })
    }

    function updateProduction() {
        post(route("production.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} production item has been successfully updated.`)
            }
        })
    }

    function deleteProduction() {
        routerDelete(route("production.delete", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} production item has been successfully deleted.`)
            }
        })
    }

    function getProductions() {
        router.get(route("production.index") + 
            `?user_id=${data.user_id}&product_id=${data.product_id}&date_start=${data.date_start}&date_end=${data.date_end}&date=${data.date}`, {
            onSuccess: (res) => {
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Productions</h2>}
        >
            <Head title="Productions" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{production.meta?.total} production entr{production.meta?.total == 1 ? "y" : "ies"}</div>
                {can(auth.user?.data, "create", "productions") && (products.data?.length ? <PrimaryButton onClick={newProduction}>new</PrimaryButton> :
                    <Link
                        href={route('product.index')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        go to products to create at least one
                    </Link>
                )}
            </div>

            <div ref={tableDiv} className={`px-6 py-12 w-full block overflow-x-auto`}>
                <Table
                    cols={["product", "selling price", "quantity", "date of production", "added", "actions"]}
                    heading={"Production"}
                    data={production.data}
                    links={production.links}
                    strips={true}
                    rowIdx={[2, 4, 5]}
                    scrollable={tableDiv}
                    rowClassName={`text-green-800 font-semibold`}
                    rowDataKeys={[
                        "product.name", 
                        "product.sellingPrice", 
                        "quantity",
                        "dateForHumans"
                    ]}
                    actions={[
                        {func: (item) => editProduction(item), disabled: (item) => processing, className: "bg-blue-600", text: "edit"},
                        {func: (item) => removeProduction(item), disabled: (item) => processing, className: "bg-red-600 hover:bg-red-500 active:bg-red-700 focus:bg-red-500 focus:ring-red-500", text: "delete"}
                    ]}
                    disableActions={item => !can(auth.user?.data, "update", "productions", item.user)}
                >
                    {filtered && <div className="w-full flex justify-start items-center my-2">
                        <div className="text-sm capitalize text-start shrink-0">filters: </div>
                        <div className="w-full flex justify-start items-center font-normal">
                            {data.product_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.product_id = ""
                                getProductions()
                            }}>filtered by {products.data?.find(u => u.id == data.product_id).name} production item</Badge>}
                            {data.date && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.date = ""
                                getProductions()
                            }}>filtered using {getDate(data.date)} date</Badge>}
                            {data.date_end && data.date_start && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.date_start = ""
                                data.date_end = ""
                                getProductions()
                            }}>filtered using dates between {data.date_start} and {data.date_end}</Badge>}
                            {data.user_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.user_id = ""
                                getProductions()
                            }}>filtered by {users.data?.find(u => u.id == data.user_id).name}</Badge>}
                        </div>
                    </div>}
                    <div className="w-full flex justify-start items-center text-sm text-gray-600 font-normal">
                        <Select
                            value={filterBy}
                            placeholder="select something to filter production by"
                            optionKey="text"
                            valueKey="query"
                            options={filters}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            onChange={(e) => {
                                setFilterBy(e.target.value)}
                            }
                        />
                        {["user_id", "product_id"].includes(filterBy) && <Select
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
                                if (filtered) getProductions()
                                if (e.target.value) setRefresh(true)
                            }}
                        />}
                        {"date" == filterBy && <TextInput
                            type="date"
                            placeholder={"select date"}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            value={data.date}
                            onChange={(e) => {
                                data.date = e.target.value
                                if (filtered) getProductions()
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
                                    if (data.date_start && data.date_end && filtered) getProductions()
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
                                    if (data.date_start && data.date_end && filtered) getProductions()
                                    if (data.date_start) setRefresh(true)
                                }}
                            />
                        </>}
                        {refresh && <ActionButton
                            className='mt-1 max-w-[200px] mr-2 p-1'
                            onClick={getProductions}
                            >filter</ActionButton>}
                        {(filtered || (data.product_id || data.user_id || data.date || (data.date_end && data.date_start))) && <ActionButton
                            className='mt-1 max-w-[200px] mr-2 p-1'
                            onClick={() => {
                                data.product_id = ""
                                data.date = ""
                                data.user_id = ""
                                data.date_end = ""
                                data.date_start = ""
                                getProductions()
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
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Production </div>
                {action != "delete" && (<form encType="multipart/form-data" className="mx-auto p-2 max-w-md" onSubmit={submit}>

                <div className="mt-4">
                        <InputLabel htmlFor="product" value="Product" />

                        <Select
                            id="product"
                            type="text"
                            name="product"
                            value={modalData.productId}
                            placeholder="select production item"
                            optionKey="name"
                            valueKey="id"
                            isFocused={true}
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
                        <InputLabel htmlFor="date" value="Date" />

                        <TextInput
                            id="date"
                            type="date"
                            name="date"
                            value={modalData.date}
                            className="mt-1 block w-full"
                            // max={getDate(null)}
                            onChange={(e) => {
                                clearErrors("date")
                                updateData('date', e.target.value)}}
                        />

                        <InputError message={errors.date} className="mt-2" />
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="quantity" value="Quantity" />

                        <TextInput
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={modalData.quantity}
                            className="mt-1 block w-full"
                            placeholder="0"
                            onChange={(e) => {
                                clearErrors("quantity")
                                updateData('quantity', e.target.value)
                            }}
                        />

                        <InputError message={errors.quantity} className="mt-2" />
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
                            disabled={processing || (action == "edit" && !(!!data.date || !!data.product_id || !!data.quantity || !!data.note))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete production associated with <span className="capitalize font-semibold">{modalData.name}</span> product</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deleteProduction}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}