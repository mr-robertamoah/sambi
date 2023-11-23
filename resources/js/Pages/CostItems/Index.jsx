import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Paginator from '@/Components/Paginator';
import PrimaryButton from '@/Components/PrimaryButton';
import CostItemCard from '@/Components/CostItemCard';
import TextBox from '@/Components/TextBox';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Select from '@/Components/Select';
import can from '@/Helpers/can';

export default function Index({ auth, costItems }) {

    let [categories, setCategories] = useState(false)
    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("create")
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        category_id: '',
        unit: '',
        unit_charge: "",
    });
    let newData = {
        id: '',
        name: '',
        description: '',
        unitCharge: "",
        categoryId: '',
        unit: '',
    }
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
        getCategories()
    }, [])

    function toggleModal() {
        setOpenModal(!openModal)
    }

    function newCostItem() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function editCostItem(costItem) {
        setAction("edit")
        setModalData((prev) => {
            return {
                id: costItem.id, 
                name: costItem.name, 
                unit: costItem.unit, 
                unitCharge: costItem.unitCharge, 
                description: costItem.description ?? "", 
                categoryId: costItem.categoryId,
            }
        })
        setOpenModal(true)
    }

    function removeCostItem(costItem) {
        setAction("delete")
        setModalData((prev) => {
            return {
                id: costItem.id, 
                name: costItem.name,
            }
        })
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createCostItem()
        }

        updateCostItem()
    }

    function updateModelData(key, value) {
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value

            if (key == "unitCharge") setData("unit_charge", value)
            else if (key == "categoryId") setData("category_id", value)
            else setData(key, value)
            return d
        })
    }

    function createCostItem() {
        post(route("cost_item.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Cost item has been successfully created.")
            }
        })
    }

    function updateCostItem() {
        post(route("cost_item.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} cost item has been successfully updated.`)
            }
        })
    }

    function deleteCostItem() {
        post(route("cost_item.remove", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} cost item has been successfully deleted.`)
            }
        })
    }

    function getCategories() {
        axios.get(route("category.index") + `?no_permissions=${true}`)
            .then((res) => {
                console.log(res, "get categories")
                setCategories([...res.data?.categories])
            })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cost Items</h2>}
        >
            <Head title="Cost Items" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{costItems.meta?.total} cost item{costItems.meta?.total == 1 ? "" : "s"}</div>
                {can(auth.user?.data, "create", "costItems") && (categories.length ? <PrimaryButton onClick={newCostItem}>new</PrimaryButton> :
                    <Link
                        href={route('category.index')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        go to categories to create at least one
                    </Link>
                )}
            </div>

            <div className={`w-full px-6 py-12 gap-6 flex justify-center flex-wrap ${costItems.meta?.total ? "md:grid grid-cols-1 md:grid-cols-2" : "flex justify-center"}`}>
                {costItems.meta?.total ? costItems.data?.map((costItem) =>(<CostItemCard
                    key={costItem.id}
                    costItem={costItem}
                    onDblClick={(e) => editCostItem(costItem)}
                    onDelete={(e) => removeCostItem(costItem)}
                ></CostItemCard>)) : <div>no cost items have been added</div>}
                
            </div>

            {costItems.meta?.total > 10 && (<Paginator
                className="my-12"
                disablePrevious={!costItems.links.prev}
                disableNext={!costItems.links.next}
                onClickPrevious={(e) => router.get(costItems.links.prev ?? "")}
                onClickNext={(e) => router.get(costItems.links.next ?? "")}
            ></Paginator>)}

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
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Cost Item</div>
                {action != "delete" && (<form encType="multipart/form-data" className="mx-auto p-2 max-w-md" onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={modalData.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => {
                                clearErrors("name")
                                updateModelData('name', e.target.value)}}
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="category" value="Category" />

                        <Select
                            id="category"
                            type="text"
                            name="category"
                            value={modalData.categoryId}
                            placeholder="select category"
                            optionKey="name"
                            valueKey="id"
                            options={categories}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("category_id")
                                updateModelData('categoryId', e.target.value)}}
                        />

                        <InputError message={errors.category_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />

                        <TextBox
                            id="description"
                            name="description"
                            value={modalData.description}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("description")
                                updateModelData('description', e.target.value)}}
                        />

                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    
                    <div className="mt-4">
                        <div className="mt-4 w-full flex justify-start items-start">
                            <div className="w-full">
                                <InputLabel htmlFor="unit_charge" value="Unit Charge" />

                                <TextInput
                                    id="unit_charge"
                                    name="unit_charge"
                                    type="text"
                                    value={modalData.unitCharge}
                                    className="mt-1 block w-full"
                                    placeholder="0.00"
                                    onChange={(e) => {
                                        clearErrors("unit_charge")
                                        updateModelData('unitCharge', e.target.value)
                                    }}
                                />

                                <InputError message={errors.unit_charge} className="mt-2" />
                            </div>
                            
                            <div className="ml-2 w-full">
                                <InputLabel htmlFor="unit" value="Unit" />

                                <TextInput
                                    id="unit"
                                    type="text"
                                    name="unit"
                                    value={modalData.unit}
                                    className="mt-1 block w-full"
                                    onChange={(e) => {
                                        clearErrors("unit")
                                        updateModelData('unit', e.target.value)}}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        
                        <PrimaryButton className="ml-4 mb-4" 
                            disabled={processing || (action == "edit" && !(!!data.description || !!data.name || !!data.file || !!data.unit_charge))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete <span className="capitalize font-semibold">{modalData.name}</span> cost item</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deleteCostItem}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
