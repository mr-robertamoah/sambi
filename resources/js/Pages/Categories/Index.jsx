import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import FileInput from '@/Components/FileInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Paginator from '@/Components/Paginator';
import PrimaryButton from '@/Components/PrimaryButton';
import CategoryCard from '@/Components/CategoryCard';
import TextBox from '@/Components/TextBox';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import can from '@/Helpers/can';

export default function Index({ auth, categories }) {

    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("create")
    const { data, setData, post, processing, errors, reset, clearErrors, delete: routerDelete } = useForm({
        name: '',
        description: '',
    });
    let newData = {
        id: '',
        name: '',
        description: '',
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

    // useEffect(function () {
    //     if (!(success && errors.failed) && action == "delete") {
    //         setOpenModal(false)
    //     }
    // }, [success, errors.failed])

    function toggleModal() {
        setOpenModal(!openModal)
    }

    function newCategory() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function editCategory(category) {
        setAction("edit")
        setModalData((prev) => {
            return {
                id: category.id, 
                name: category.name, 
                description: category.description ?? "", 
            }
        })
        setOpenModal(true)
    }

    function removeCategory(category) {
        setAction("delete")
        setModalData((prev) => {
            return {
                id: category.id, 
                name: category.name,
            }
        })
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createCategory()
        }

        updateCategory()
    }

    function updateModelData(key, value) {
        clearErrors(key)
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value
            setData(key, value)
            return d
        })
    }

    function createCategory() {
        post(route("category.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Category has been successfully created.")
            }
        })
    }

    function updateCategory() {
        post(route("category.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} category has been successfully updated.`)
            }
        })
    }

    function deleteCategory() {
        routerDelete(route("category.delete", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} category has been successfully deleted.`)
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Categories</h2>}
        >
            <Head title="Categories" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{categories.meta?.total ?? 0} categor{categories.meta?.total == 1 ? "y" : "ies"}</div>
                {can(auth.user?.data, "create", "categories") && <PrimaryButton onClick={newCategory}>new</PrimaryButton>}
            </div>

            <div className={`w-full px-6 py-12 gap-6 flex justify-center flex-wrap ${categories.meta?.total ? "md:grid grid-cols-1 md:grid-cols-2" : "flex justify-center"}`}>
                {categories.meta?.total ? categories.data?.map((category) =>(<CategoryCard
                    key={category.id}
                    category={category}
                    onDblClick={(e) => editCategory(category)}
                    onDelete={(e) => removeCategory(category)}
                ></CategoryCard>)) : <div>no categories have been added</div>}
                
            </div>

            {categories.meta?.total > 10 && (<Paginator
                className="my-12"
                disablePrevious={!categories.links.prev}
                disableNext={!categories.links.next}
                onClickPrevious={(e) => router.get(categories.links.prev ?? "")}
                onClickNext={(e) => router.get(categories.links.next ?? "")}
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
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Category</div>
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
                            onChange={(e) => updateModelData('name', e.target.value)}
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />

                        <TextBox
                            id="description"
                            name="description"
                            value={modalData.description}
                            className="mt-1 block w-full"
                            onChange={(e) => updateModelData('description', e.target.value)}
                        />

                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        
                        <PrimaryButton className="ml-4 mb-4" 
                            disabled={processing || (action == "edit" && !(!!data.description || !!data.name))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete <span className="capitalize font-semibold">{modalData.name}</span> category</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deleteCategory}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
