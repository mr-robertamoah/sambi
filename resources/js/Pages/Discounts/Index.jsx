import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import Select from '@/Components/Select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Paginator from '@/Components/Paginator';
import PrimaryButton from '@/Components/PrimaryButton';
import DiscountCard from '@/Components/DiscountCard';
import TextBox from '@/Components/TextBox';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import can from '@/Helpers/can';

export default function Index({ auth, discounts, users, permission }) {

    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("create")
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        assignee_id: '',
        name: '',
        permission_ids: [],
        description: '',
        amount: '',
        type: '',
    });
    let newData = {
        userId: '',
        id: '',
        name: '',
        description: '',
        amount: '',
        type: '',
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
        if (permission?.data) setData("permission_ids", [permission?.data.id])
    }, [permission])

    function toggleModal() {
        setOpenModal(!openModal)
    }

    function newDiscount() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function editDiscount(discount) {
        setAction("edit")
        setModalData((prev) => {
            return {
                id: discount.id, 
                name: discount.name, 
                amount: discount.amount, 
                type: discount.type, 
                description: discount.description ?? "", 
            }
        })
        setOpenModal(true)
    }

    function removeDiscount(discount) {
        setAction("delete")
        setModalData((prev) => {
            return {
                id: discount.id, 
                name: discount.name,
            }
        })
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createDiscount()
        }

        updateDiscount()
    }

    function updateData(key, value) {
        clearErrors(key)
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value
            if (key == "userId") setData("assignee_id", value)
            else setData(key, value)
            return d
        })
    }

    function createDiscount() {
        post(route("discount.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Discount has been successfully created.")
            }
        })
    }

    function updateDiscount() {
        post(route("discount.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} discount has been successfully updated.`)
            }
        })
    }

    function deleteDiscount() {
        post(route("discount.remove", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} discount has been successfully deleted.`)
            }
        })
    }
    
    function assignPermission() {
        let usersName = users.data.find(user => user.id == data.assignee_id)?.name
        post(route("user.permissions.update", auth.user.data?.id), {
        onSuccess: (res) => {
            setSuccess(`${usersName} has successfully being assigned permission to apply discounts. To remove permission, go to users or permissions.`)
            users.data = [...users.data.filter(user => user.id != data.assignee_id)]
            updateData("userId", "")
        },
        onError: (e) => {
            console.error(e, "sync")
        }})
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Discounts</h2>}
        >
            <Head title="Discounts" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{discounts.meta?.total ?? 0} discount{discounts.meta?.total == 1 ? "" : "s"}</div>
                <div>
                    <PrimaryButton className='mr-2' onClick={newDiscount}>new</PrimaryButton>
                    {(discounts.meta?.total > 0 && can(auth.user?.data, "assign", "permissions") && users.data?.length) && <PrimaryButton onClick={() => {
                        setAction("assign")
                        setOpenModal(true)
                    }}>assign permission</PrimaryButton>}
                </div>
            </div>

            <div className={`w-full px-6 py-12 gap-6 flex justify-center flex-wrap ${discounts.meta?.total ? "md:grid grid-cols-1 md:grid-cols-2" : "flex justify-center"}`}>
                {discounts.meta?.total ? discounts.data?.map((discount) =>(<DiscountCard
                    key={discount.id}
                    discount={discount}
                    onDblClick={(e) => editDiscount(discount)}
                    onDelete={(e) => removeDiscount(discount)}
                ></DiscountCard>)) : <div>no discounts have been added</div>}
                
            </div>

            {discounts.meta?.total > 10 && (<Paginator
                className="my-12"
                disablePrevious={!discounts.links.prev}
                disableNext={!discounts.links.next}
                onClickPrevious={(e) => router.get(discounts.links.prev ?? "")}
                onClickNext={(e) => router.get(discounts.links.next ?? "")}
            ></Paginator>)}

            <Creator className="mt-3"></Creator>

            <Modal
                show={openModal}
                onClose={toggleModal}
            >
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Discount</div>
                <Alert
                    show={errors.failed || success}
                    type={success ? "success" : "failed"}
                    onDisappear={() => {
                        if (action == "delete" && !modalData.id) setOpenModal(false)
                    }}
                >{success ?? errors.failed}</Alert>
                {processing && (<div className={`w-full text-center flex rounded-full mt-4 mb-2 justify-center items-center ${action != "delete" ? "text-green-600" : "text-red-600"}`}>
                    <div className={`mr-2 animate-ping w-3 h-3 ${action != "delete" ? "bg-green-400" : "bg-red-400"}`}></div> {
                        action == "create" ? "creating" : 
                        action == "edit" ? "editing" :  
                        action == "assign" ? "assigning" : "deleting"
                    }...
                </div>)}
                {["create", "edit"].includes(action) && (<form className="mx-auto p-2 max-w-md" onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={modalData.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => updateData('name', e.target.value)}
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="type" value="Type" />

                        <Select
                            id="type"
                            type="text"
                            name="type"
                            value={modalData.type}
                            placeholder="select type of discount"
                            optionKey="key"
                            valueKey="key"
                            options={[
                                {key: "fixed"},
                                {key: "percent"},
                            ]}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("type")
                                updateData('type', e.target.value)
                            }}
                        />

                        <InputError message={errors.type} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="amount" value="Amount" />

                        <TextInput
                            id="amount"
                            type="number"
                            steps="0.01"
                            name="amount"
                            value={modalData.amount}
                            className="mt-1 block w-full"
                            onChange={(e) => updateData('amount', e.target.value)}
                        />

                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />

                        <TextBox
                            id="description"
                            name="description"
                            value={modalData.description}
                            className="mt-1 block w-full"
                            onChange={(e) => updateData('description', e.target.value)}
                        />

                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        
                        <PrimaryButton className="ml-4 mb-4" 
                            disabled={processing || (action == "edit" && !(!!data.description || !!data.name || !!data.amount || !!data.type))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {"assign" == action && (<form encType="multipart/form-data" className="mx-auto p-2 max-w-md" onSubmit={submit}>
                    {data.assignee_id && <div className='text-sm my-4 text-gray-600 text-center'>
                        you are trying to assign <span className='font-semibold'>{users.data.find(user => user.id == data.assignee_id)?.name}</span> the permission to APPLY DISCOUNTS on sales
                    </div>}
                    <div className="mt-4">
                        <InputLabel htmlFor="user" value="User" />

                        <Select
                            id="user"
                            type="text"
                            name="user"
                            value={modalData.userId}
                            placeholder="select user"
                            optionKey="name"
                            valueKey="id"
                            options={users.data ?? []}
                            className="mt-1 block w-full"
                            onChange={(e) => {
                                clearErrors("assignee_id")
                                updateData('userId', e.target.value)
                            }}
                        />

                        <InputError message={errors.assignee_id} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        
                        <PrimaryButton className="ml-4 mb-4" 
                            disabled={processing || (action == "edit" && !(!!data.assignee_id))}
                            onClick={assignPermission}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete <span className="capitalize font-semibold">{modalData.name}</span> discount</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deleteDiscount}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
