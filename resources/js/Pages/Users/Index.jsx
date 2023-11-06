import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import FileInput from '@/Components/FileInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Paginator from '@/Components/Paginator';
import PrimaryButton from '@/Components/PrimaryButton';
import ProductCard from '@/Components/ProductCard';
import TextBox from '@/Components/TextBox';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, users }) {

    let [openModal, setOpenModal] = useState(false)
    let [success, setSuccess] = useState()
    let [action, setAction] = useState("delete")
    let newData = {
        id: '',
        permissionIds: [],
    }
    let [modalData, setModalData] = useState(newData);

    useEffect(function () {
        if (!openModal) {
            reset()
            setModalData(newData)
        }

        if (success && openModal) setSuccess(null)
        if (errors.failed && openModal) errors.failed = null
        
    }, [openModal])

    function toggleProductModal() {
        setOpenModal(!openModal)
    }

    function removeUser(user) {
        setAction("delete")
        setModalData((prev) => {
            return {
                id: user.id, 
                name: user.name,
            }
        })
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()
    }

    function updateModelData(value) {
        setModalData((prev) => {
            let d = {...prev}
            d["permissionIds"] = [...prev["permissionIds"], value]
            return d
        })
    }

    function syncPermissions() {
        post(route("product.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} product has been successfully updated.`)
            }
        })
    }

    function deleteProduct() {
        router.delete(route("product.delete", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setSuccess(`${modalData.name} product has been successfully deleted.`)
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{products.meta.total} product{products.meta.total == 1 ? "" : "s"}</div>
                <PrimaryButton onClick={newProduct}>new</PrimaryButton>
            </div>

            <div className={`px-6 py-12 gap-6 flex-wrap ${products.meta.total ? "grid grid-cols-1 md:grid-cols-2" : "flex justify-center"}`}>
                {products.meta.total ? products.data.map((product) =>(<ProductCard
                    key={product.id}
                    product={product}
                    onDblClick={(e) => editProduct(product)}
                    onDelete={(e) => removeProduct(product)}
                ></ProductCard>)) : <div>no products have been added</div>}
                
            </div>

            {products.meta.total > 10 && (<Paginator
                className="my-12"
                disablePrevious={!products.links.prev}
                disableNext={!products.links.next}
                onClickPrevious={(e) => router.get(products.links.prev ?? "")}
                onClickNext={(e) => router.get(products.links.next ?? "")}
            ></Paginator>)}

            <Creator className="mt-3"></Creator>

            <Modal
                show={openModal}
                onClose={toggleProductModal}
            >
                <Alert
                    show={errors.failed || success}
                    type={success ? "success" : "failed"}
                    onDisappear={() => {
                        // if (success) setSuccess()
                        // if (errors.failed) errors.failed = null
                        if (action == "delete" && !modalData.id) setOpenModal(false)
                    }}
                >{success ?? errors.failed}</Alert>
                {processing && (<div className={`w-full text-center flex rounded-full mt-4 mb-2 justify-center items-center ${action != "delete" ? "text-green-600" : "text-red-600"}`}>
                    <div className={`mr-2 animate-ping w-3 h-3 ${action != "delete" ? "bg-green-400" : "bg-red-400"}`}></div> {action == "create" ? "creating" : action == "edit" ? "editing" : "deleting"}...
                </div>)}
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Product</div>
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
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="selling_price" value="Selling Price" />

                        <TextInput
                            id="selling_price"
                            name="selling_price"
                            type="text"
                            value={modalData.sellingPrice}
                            className="mt-1 block w-full"
                            placeholder="0.00"
                            onChange={(e) => {
                                updateModelData('sellingPrice', e.target.value)
                            }}
                        />

                        <InputError message={errors.selling_price} className="mt-2" />
                    </div>

                    <div className="block mt-4">
                        <FileInput 
                            id="file"
                            name="file"
                            defaultFilename={modalData.filename ?? "no image"}
                            defaultButtonText="upload image"
                            src={modalData.src}
                            onChange={(e) => {
                                updateModelData('file', e.target.files.length ? e.target.files[0] : null)
                            }}
                            onDelete={(e) => {
                                updateModelData('file', null)
                            }}
                            getFileOnDelete={action == "edit" ? true : false}
                        ></FileInput>

                        <InputError message={errors.file} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        
                        <PrimaryButton className="ml-4 mb-4" 
                            disabled={processing || (action == "edit" && !(!!data.description || !!data.name || !!data.file || !!data.selling_price))}
                        >
                            {action}
                        </PrimaryButton>
                    </div>
                </form>)}
                {action == "delete" && (
                    <div className="mx-auto w-4/5 text-center mb-3">
                        <div className="text-gray-600">Are you sure you want to delete <span className="capitalize font-semibold">{modalData.name}</span> product</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton onClick={deleteProduct}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
