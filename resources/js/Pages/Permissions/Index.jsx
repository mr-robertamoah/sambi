import ActionButton from '@/Components/ActionButton';
import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PermissionBadge from '@/Components/PermissionBadge';
import PrimaryButton from '@/Components/PrimaryButton';
import ProfilePicture from '@/Components/ProfilePicture';
import TextBox from '@/Components/TextBox';
import TextInput from '@/Components/TextInput';
import can from '@/Helpers/can';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, permissions }) {

    let [openModal, setOpenModal] = useState(false)
    let [permissionsData, setPermissionsData] = useState({
        data: null, id: null
    })
    let [loading, setLoading] = useState(false)
    let [users, setUsers] = useState([])
    let [success, setSuccess] = useState()
    let [search, setSearch] = useState("")
    let [action, setAction] = useState("create")
    const { data, setData, delete: routeDelete, get, post, processing, errors, reset } = useForm({
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
            setModalData(newData)
        }

        if (success) setSuccess(null)
        if (errors.failed) errors.failed = null
        
    }, [openModal])

    useEffect(function () {
        getUsers()
    }, [search])

    useEffect(function () {
        if (
            (modalData.id != permissionsData?.id && action != "edit") &&
            !!modalData.id
        ) {
            getPermissionDetail()
        }
    }, [modalData.id])

    function toggleModal() {
        setOpenModal(!openModal)
    }

    function newPermission() {
        setAction("create")
        reset()
        setModalData(newData)
        setOpenModal(true)
    }

    function showDetails(permission) {
        updateModalData(permission)
    }

    function updateModalData(permission) {
        setModalData((prev) => {
            return {
                id: permission.id, 
                name: permission.name, 
                description: permission.description ?? "", 
            }
        })
    }

    function editPermission(permission) {
        setAction("edit")
        if (permission) updateModalData(permission)
        setOpenModal(true)
    }

    function removePermission(permission) {
        setAction("delete")
        setModalData((prev) => {
            return {
                id: permission.id, 
                name: permission.name,
            }
        })
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()

        if (action == "create") {
            return createPermission()
        }

        updatePermission()
    }

    function updateModelData(key, value) {
        setModalData((prev) => {
            let d = {...prev}
            d[key] = value

            setData(key, value)
            return d
        })
    }

    function createPermission() {
        post(route("permission.create"), {
            onSuccess: (e) => {
                reset()
                setModalData(newData)
                setSuccess("Permission has been successfully created.")
            }
        })
    }

    function updatePermission() {
        post(route("permission.update", modalData.id), {
            onSuccess: (e) => {
                reset()
                setSuccess(`${modalData.name} permission has been successfully updated.`)
            }
        })
    }

    function deletePermission() {
        routeDelete(route("permission.delete", modalData.id), {
            onSuccess: (e) => {
                setModalData(newData)
                setPermissionsData(null)
                setSuccess(`${modalData.name} permission has been successfully deleted.`)
            }
        })
    }

    function getPermissionDetail() {
        setLoading(true)
        setAction("getting")
        setPermissionsData(null)
        axios.get(route("permission.detail", modalData.id))
            .then((res) => {
                console.log(res)
                // setModalData(newData)
                setPermissionsData({
                    data: [...res.data?.detail.assignedUsers],
                    id: modalData.id
                })
            })
            .finally(() => setLoading(false))
    }

    function getUsers() {
        setLoading(true)
        setAction("users")
        axios.get(route("user.index") + `?name=${search}`)
            .then((res) => {
                console.log(res)
                // setModalData(newData)
                setUsers([...res.data?.users])
            })
            .finally(() => setLoading(false))
    }
    
    function syncPermissions(assigned) {
        setLoading(true)
        setAction("syncing")
        axios.post(route("user.permissions.update", auth.user.data?.id), 
        {
            "permission_ids": [
                permissionsData.id
            ],
            "assignee_id": assigned.assignee.id
        })
        .then((res) => {
            console.log(res, "sync")
            setSuccess(res.data?.success)
            setPermissionsData(prev => {
                return {
                    id: prev.id,
                    data: [
                        ...(prev.data?.filter(item => item.id != assigned.id))
                    ]
                }
            })
        })
        .catch((e) => {
            console.error(e, "sync")
            // setErrors(() => {
            //     return {failed: e.response.data?.message}
            // })
        })
        .finally(() => {
            setLoading(false)
        })
    }
    
    function assignPermission(user) {
        setLoading(true)
        setAction("syncing")
        axios.post(route("user.permissions.update", auth.user.data?.id), 
        {
            "permission_ids": [
                permissionsData.id
            ],
            "assignee_id": user.id,
        })
        .then((res) => {
            console.log(res, "sync")
            let arr = [...permissionsData.data?.filter(d => d.assignee.id != user.id)]
            if (res.data?.assigned) arr = [...arr, res.data?.assigned]
            console.log(arr)
            setSuccess(res.data?.success)
            setPermissionsData(prev => {
                return {
                    id: prev.id,
                    data: arr
                }
            })
        })
        .catch((e) => {
            console.error(e, "sync")
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Permissions</h2>}
        >
            <Head title="Permissions" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{permissions.data?.length} permssion{permissions.data?.length == 1 ? "" : "s"}</div>
                {can(auth.user.data, "manage", "permissions") && <div className="flex justify-end items-center">
                    <PrimaryButton onClick={newPermission}>new</PrimaryButton>
                    {permissionsData?.data && <>
                        <PrimaryButton className="ml-2" 
                            onClick={() => editPermission(permissions.data?.find(perm => perm.id == permissionsData.id))}
                        >edit</PrimaryButton>
                        <DeleteButton className="ml-2" 
                            onClick={() => removePermission(permissions.data?.find(perm => perm.id == permissionsData.id))}
                        >delete</DeleteButton>
                    </>}
                </div>}
            </div>

            <div className={`p-6 flex justify-start items-center overflow-x-auto text-white bg-white`}>
                {permissions.data?.length ? permissions.data?.map((permission) =>(<PermissionBadge
                    key={permission.id}
                    permission={permission}
                    active={permission.id == modalData?.id}
                    // onDblClick={(e) => editPermission(permission)}
                    onDelete={(e) => removePermission(permission)}
                    onClick={(e) => showDetails(permission)}
                    className='shrink-0 mx-2 bg-slate-600 text-white hover:bg-slate-700'
                ></PermissionBadge>)) : <div className="w-full h-1/4 flex items-center justify-center text-sm text-gray-600 hover:bg-slate-700">no permissions have been added</div>}
                
            </div>
            
            <div className="w-full my-2">
                {loading && (<div className={`w-full text-center flex rounded-full mt-4 mb-2 justify-center items-center ${action != "delete" ? "text-green-600" : "text-red-600"}`}>
                    <div className={`mr-2 animate-ping w-3 h-3 ${action != "delete" ? "bg-green-400" : "bg-red-400"}`}></div> {action == "syncing" ? "syncing" : action =="delete" ? "deleting permission" : "getting"}...
                </div>)}
                <Alert
                    show={(errors.failed || success) && !["delete", "edit", "create"].includes(action)}
                    type={success ? "success" : "failed"}
                    onDisappear={() => {
                        if (success && openModal) setSuccess(null)
                        if (errors.failed && openModal) errors.failed = null
                    }}
                >{success ?? errors.failed}</Alert>
                {modalData.id && <div className="transition-all duration-150 w-full bg-white text-center p-6">
                    <div className="text-sm text-gray-600">assign <span className="font-semibold capitalize">{modalData.name}</span> permission to users</div>
                    <div className="my-3 flex justify-start items-center overflow-x-auto p-3 bg-slate-100">
                        {users.length ? users.map(user => <div 
                            onClick={() => {
                                assignPermission(user)}
                            }
                            title={`click to assign ${modalData.name} permission to ${user.name}`}
                            key={user.id} 
                            className="mx-3 p-3 rounded cursor-pointer bg-white min-w-[150px] max-w-[200px] flex justify-start items-center">
                                <ProfilePicture
                                src={user.image?.src}
                                className='mr-2 w-8 h-8 shrink-0'
                                size={8}
                                showDefaultText={false}
                            ></ProfilePicture>
                            <div className="text-sm text-gray-600">{user.name}</div>
                        </div>) : <div className="text-gray-600 text-sm text-center w-full">no users yet</div>}
                    </div>
                    <div className="w-full flex justify-center">
                        <TextInput
                            placeholder="search for user"
                            id="search"
                            type="text"
                            name="search"
                            value={search}
                            className="mt-1 block w-full max-w-sm"
                            isFocused={true}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>}
            </div>
            <div className="mt-4 w-full p-2 sm:p-4 flex justify-center items-center min-h-[200px] relative">
                
                {permissionsData?.data ? 
                <div className="block overflow-x-auto w-full mb-5">
                    <div className="w-full">
                    {modalData.id && <div
                        className="bg-slate-600 rounded-t py-4 text-center text-sm text-white capitalize font-bold"
                    >current permission: <span className="uppercase">{modalData.name}</span></div>}
                    <table className="table-auto bg-white rounded p-2 border-collapse w-full">
                        <thead>
                            <tr className="bg-slate-600 rounded border-b-2 border-white border py-4 text-sm text-white capitalize">
                                <th className="rounded-bl py-4 my-2 min-h-[20px]">assigned by</th>
                                <th>assigned to</th>
                                <th className="">assigned on</th>
                                <th className="rounded-br">actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissionsData?.data?.length ? permissionsData?.data?.map((assigned, index) => <tr className=" text-sm font-normal table-row border-b-2 whitespace-nowrap overflow-x-auto" key={index + 1}>
                                <td className="font-normal py-4 px-2 border-r-2 min-h-[20px] whitespace-nowrap">
                                    <div className="flex justify-start w-full items-center">
                                            <ProfilePicture
                                            src={assigned.assigner.image?.src}
                                            className='mr-2 w-8 h-8 shrink-0'
                                            size={8}
                                            showDefaultText={false}
                                        ></ProfilePicture>
                                        <div>{assigned.assigner.name}</div>
                                    </div>
                                </td>
                                <td className="font-normal py-4 px-2 border-r-2 min-h-[20px] whitespace-nowrap">
                                    <div className="flex justify-start w-full items-center">
                                            <ProfilePicture
                                            src={assigned.assignee.image?.src}
                                            className='mr-2 w-8 h-8 shrink-0'
                                            size={8}
                                            showDefaultText={false}
                                        ></ProfilePicture>
                                        <div>{assigned.assignee.name}</div>
                                    </div>
                                </td>
                                <td className="border-r-2">
                                    <div className="font-normal whitespace-nowrap text-center">{assigned.createdAt}</div>
                                </td>
                                <td className="text-center">
                                    <ActionButton
                                        onClick={() => syncPermissions(assigned)}
                                        className="bg-blue-600"
                                        disabled={loading && action == "syncing"}
                                    >unassign</ActionButton>
                                </td>
                            </tr>) :
                            <tr>
                                <td colSpan="100%" className="h-[20px] py-4 px-2 col-span-3 text-center">not assigned</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    </div>
                </div> :
                <div>click to show details of permission</div> 
                }
            </div>

            <Creator className="mt-3 bottom-0"></Creator>

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
                <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">{action} Permission</div>
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
                            value={modalData.description ?? ""}
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
                        <div className="text-gray-600">Are you sure you want to delete <span className="capitalize font-semibold">{modalData.name}</span> permission</div>
                        <div className="flex justify-between items-center mt-3">
                            <PrimaryButton disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                            <DeleteButton disabled={processing} onClick={deletePermission}>delete</DeleteButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
