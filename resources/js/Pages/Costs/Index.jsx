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

export default function Index({ auth, costs, users, costItems, filtered, filteredData }) {

    let tableDiv = useRef(null)
    let [filterBy, setFilterBy] = useState("")
    let [refresh, setRefresh] = useState(false)
    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("create")
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        cost_item_id: '',
        number_of_units: '',
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
        numberOfUnits: "",
        costItemId: '',
        date: '',
    }
    let filters = [
        {query: "user_id", text: "person who added"}, 
        {query: "cost_item_id", text: "cost item"}, 
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
        if (filterBy == "cost_item_id") setFilterData(costItems.data?.map(costItem => {
            return {key: costItem.name, value: costItem.id}
        }))
    }, [filterBy])

    useEffect(() => {
        if (!filteredData) return

        if (filteredData["cost_item_id"]) {
            setFilterBy("cost_item_id")
            setRefresh(true)
            data.cost_item_id = filteredData["cost_item_id"]
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

    function newCost() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function updateModalData(cost) {
        setModalData((prev) => {
            return {
                id: cost.id, 
                name: cost.costItem.name,
                numberOfUnits: cost.numberOfUnits, 
                note: cost.note ?? "", 
                date: getDate(cost.date),
                costItemId: cost.costItem.id,
            }
        })
    }

    function editCost(cost) {
        setAction("edit")
        updateModalData(cost)
        setOpenModal(true)
    }

    function removeCost(cost) {
        setAction("delete")
        updateModalData(cost)
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createCost()
        }

        updateCost()
    }

    function updateData(key, value) {
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value

            if (key == "numberOfUnits") setData("number_of_units", value)
            else if (key == "costItemId") setData("cost_item_id", value)
            else if (["note", "date"].includes(key)) setData(key, value)
            return d
        })
    }

    function createCost() {
        post(route("cost.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Cost item has been successfully created.")
            }
        })
    }

    function updateCost() {
        post(route("cost.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} cost item has been successfully updated.`)
            }
        })
    }

    function deleteCost() {
        post(route("cost.remove", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} cost item has been successfully deleted.`)
            }
        })
    }

    function getName() {
        let objs = filterBy == "user_id" ? users.data : costItems.data
        let name = objs.find(ob => ob.id == data[filterBy])?.id 

        return name ?? ""
    }

    function getCosts() {
        router.get(route("cost.index") + 
            `?user_id=${data.user_id}&cost_item_id=${data.cost_item_id}&date_start=${data.date_start}&date_end=${data.date_end}&date=${data.date}`, {
            onSuccess: (res) => {
                console.log(res)
                // setFilterBy("")
                // setRefresh(false)
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Costs</h2>}
        >
            <Head title="Costs" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{costs.meta?.total} cost entr{costs.meta?.total == 1 ? "y" : "ies"}</div>
                {can(auth.user?.data, "create", "costs") && (costItems.data?.length ? <PrimaryButton onClick={newCost}>new</PrimaryButton> :
                    <Link
                        href={route('cost_item.index')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        go to cost items to create at least one
                    </Link>
                )}
            </div>

            <div ref={tableDiv} className={`px-6 py-12 w-full block overflow-x-auto`}>
                <Table
                    cols={["cost item", "price per unit", "unit", "number of units", "total cost", "date of transaction", "added", "actions"]}
                    heading={"incurred costs"}
                    data={costs.data}
                    links={costs.links}
                    strips={true}
                    scrollable={tableDiv}
                    rowIdx={[2, 5]}
                    rowClassName={`text-green-800 font-semibold`}
                    rowDataKeys={[
                        "costItem.name", 
                        (item) => `GHȻ ${item.costItem.unitCharge}`,
                        "costItem.unit", 
                        "numberOfUnits",
                        (item) => `GHȻ ${item.numberOfUnits * item.costItem.unitCharge}`,
                        "dateForHumans"
                    ]}
                    actions={[
                        {func: (item) => editCost(item), disabled: (item) => processing, className: "bg-blue-600", text: "edit"},
                        {func: (item) => removeCost(item), disabled: (item) => processing, className: "bg-red-600 hover:bg-red-500 active:bg-red-700 focus:bg-red-500 focus:ring-red-500", text: "delete"}
                    ]}
                    disableActions={item => !can(auth.user?.data, "update", "costs", item.user)}
                >
                    {filtered && <div className="w-full flex justify-start items-center my-2">
                        <div className="text-sm capitalize text-start shrink-0">filters: </div>
                        <div className="w-full flex justify-start items-center font-normal">
                            {data.cost_item_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.cost_item_id = ""
                                getCosts()
                            }}>filtered by {costItems.data?.find(u => u.id == data.cost_item_id).name} cost item</Badge>}
                            {data.date && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.date = ""
                                getCosts()
                            }}>filtered using {getDate(data.date)} date</Badge>}
                            {data.date_end && data.date_start && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.date_start = ""
                                data.date_end = ""
                                getCosts()
                            }}>filtered using dates between {data.date_start} and {data.date_end}</Badge>}
                            {data.user_id && <Badge className='mx-2 text-white bg-slate-900 p-1 text-sm lowercase' onClose={() => {
                                data.user_id = ""
                                getCosts()
                            }}>filtered by {users.data?.find(u => u.id == data.user_id).name}</Badge>}
                        </div>
                    </div>}
                    <div className="w-full flex justify-start items-center text-sm text-gray-600 font-normal">
                        <Select
                            value={filterBy}
                            placeholder="select something to filter costs by"
                            optionKey="text"
                            valueKey="query"
                            options={filters}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            onChange={(e) => {
                                setFilterBy(e.target.value)}
                            }
                        />
                        {["user_id", "cost_item_id"].includes(filterBy) && <Select
                            type="text"
                            value={filterBy == "user_id" ? data.user_id : data.cost_item_id}
                            placeholder={`filter by ${filters.find(f => f.query == filterBy)?.text}`}
                            optionKey="key"
                            valueKey="value"
                            options={filterData}
                            className="mt-1 max-w-[200px] mr-2 p-1"
                            onChange={(e) => {
                                setData(filterBy, e.target.value)
                                data[filterBy] = e.target.value
                                if (filtered) getCosts()
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
                                if (filtered) getCosts()
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
                                    console.log(data.date_start, e.target.value)
                                    if (data.date_start && data.date_end && filtered) getCosts()
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
                                    if (data.date_start && data.date_end && filtered) getCosts()
                                    if (data.date_start) setRefresh(true)
                                }}
                            />
                        </>}
                        {refresh && <ActionButton
                            className='mt-1 max-w-[200px] mr-2 p-1'
                            onClick={getCosts}
                            >filter</ActionButton>}
                        {(filtered || (data.cost_item_id || data.user_id || data.date || (data.date_end && data.date_start))) && <ActionButton
                            className='mt-1 max-w-[200px] mr-2 p-1'
                            onClick={() => {
                                data.cost_item_id = ""
                                data.date = ""
                                data.user_id = ""
                                data.date_end = ""
                                data.date_start = ""
                                getCosts()
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
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Cost </div>
                {action != "delete" && (<form encType="multipart/form-data" className="mx-auto p-2 max-w-md" onSubmit={submit}>

                <div className="mt-4">
                        <InputLabel htmlFor="costItem" value="Cost Item" />

                        <Select
                            id="costItem"
                            type="text"
                            name="costItem"
                            value={modalData.costItemId}
                            placeholder="select cost item"
                            optionKey="name"
                            valueKey="id"
                            isFocused={true}
                            options={costItems.data}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("cost_item_id")
                                updateData('costItemId', e.target.value)
                            }}
                        />

                        <InputError message={errors.cost_item_id} className="mt-2" />
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
                            disabled={processing || (action == "edit" && !(!!data.date || !!data.cost_item_id || !!data.number_of_units || !!data.note))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete cost associated with <span className="capitalize font-semibold">{modalData.name}</span> cost item</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deleteCost}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}