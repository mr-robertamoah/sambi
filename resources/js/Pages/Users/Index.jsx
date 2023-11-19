import Alert from '@/Components/Alert';
import Creator from '@/Components/Creator';
import DeleteButton from '@/Components/DeleteButton';
import Modal from '@/Components/Modal';
import Paginator from '@/Components/Paginator';
import PrimaryButton from '@/Components/PrimaryButton';
import UserCard from '@/Components/UserCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import can from '@/Helpers/can';
import PermissionBadge from '@/Components/PermissionBadge';
import ProfilePicture from '@/Components/ProfilePicture';
import Back from '@/Icons/Back';

export default function Index({ auth, users }) {

    let [openModal, setOpenModal] = useState(false)
    let [processing, setProcessing] = useState()
    let [success, setSuccess] = useState()
    let [searching, setSearching] = useState(false)
    let [permissions, setPermissions] = useState([])
    let [existingPermissions, setExistingPermissions] = useState([])
    let [removedPermissions, setRemovedPermissions] = useState([])
    let [addedPermissions, setAddedPermissions] = useState([])
    let [canAssign, setCanAssign] = useState(false)
    let [errors, setErrors] = useState({
        failed: null,
        search: null,
    })
    let [action, setAction] = useState("delete")
    let newData = {
        id: '',
        name: '',
        email: '',
    }
    let [modalData, setModalData] = useState(newData);

    useEffect(() => {
        setCanAssign(can(auth.user?.data, "assign", "permissions"))
    }, [])

    useEffect(() => {
        setExistingPermissions(()=>{
            let u = users.data?.find(u => u.id == modalData.id)

            return u?.permissions ? [...u.permissions] : []
        })
    }, [users.data, modalData.id])

    useEffect(function () {
        if (!openModal) {
            setModalData(newData)
        }

        if (success && openModal) setSuccess(null)
        if (errors.failed && openModal) setErrors({failed: null})
        
    }, [openModal])

    function toggleProductModal() {
        setOpenModal(!openModal)
    }

    function viewUser(user) {
        setAction("view")
        debounceSearch(user.id)
        setPermissions([])
        setAddedPermissions([])
        setRemovedPermissions([])
        setExistingPermissions([...user.permissions])
        setUser(user)
        setOpenModal(true)
    }

    function setUser(user) {
        setModalData((prev) => {
            return {
                id: user.id, 
                name: user.name,
                email: user.email,
            }
        })
    }

    function removeUser(user) {
        setAction("delete")
        setUser(user)
        setOpenModal(true)
    }

    function submit(event) {
        event.preventDefault()
    }

    function syncPermissions() {
        setProcessing(true)
        router.post(route("user.permissions.update", auth.user.data?.id), 
        {
            "permission_ids": [
                ...addedPermissions.map(perm => perm.id),
                ...removedPermissions.map(perm => perm.id),
            ],
            "assignee_id": modalData.id
        },{
        onSuccess: (data) => {
            console.log(data, "sync")
            let perms = [...addedPermissions, ...existingPermissions]
            setSuccess(`now, ${modalData.name}, ${perms.map(perm => perm.name).join("; ")}.`)
        },
        onError: (e) => {
            console.error(e, "sync")
            setErrors(() => {
                return {failed: e.response.data?.message}
            })
        },
        onFinish: () => {
            setProcessing(false)
            setAddedPermissions([])
            setRemovedPermissions([])
        }})
    }

    function deleteUser() {
        setProcessing(true)
        router.delete(route("user.delete", modalData.id), {
            onSuccess: () => {
                setProcessing(false)
                setSuccess(`${modalData.name} user has been successfully deleted.`)
                setModalData(newData)
            },
            onError: (e) => {
                console.error(e, "delete")
                setErrors(() => {
                    return {failed: e.failed}
                })
            },
            onFinish: () => setProcessing(false)
        })
    }

    let debounceSearch = useMemo((id) => _.debounce(() => getPermissions(id), 200), [])

    function getPermissions(id) {
        setSearching(true)
        axios.get(route("permissions.get") + `?assignee_id=${id}`)
        .then((res) => {
                setPermissions(res.data ? res.data?.permissions.data : [])
                setProcessing(false)
            })
        .catch((e) => {
                console.error(e, "getPermissions")
                setErrors(() => {
                    return {failed: e.response.data?.message}
                })
            }
        )
        .finally(() => {
            setSearching(false)
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title="Users" />

            <div className="flex justify-between items-center my-4 p-2 max-w-3xl mx-auto">
                <div className="text-sm text-gray-600">{users.meta?.total} other user{users.meta?.total == 1 ? "" : "s"}</div>
            </div>

            <div className={`w-full px-6 py-12 gap-6 flex justify-center flex-wrap ${users.meta?.total ? "md:grid grid-cols-1 md:grid-cols-2" : "flex justify-center"}`}>
                {users.meta?.total ? users.data?.map((user) =>(<UserCard
                    key={user.id}
                    user={user}
                    authUser={auth.user?.data}
                    title={`double click to view ${user.name} user`}
                    onDblClick={(e) => viewUser(user)}
                    onDelete={can(auth.user?.data, "delete", "users") ? (e) => removeUser(user) : null}
                ></UserCard>)) : <div className="w-full h-1/4 flex items-center justify-center text-sm text-gray-600">no other user apart from you</div>}
                
            </div>

            {users.meta?.total > 10 && (<Paginator
                className="my-12"
                disablePrevious={!users.links.prev}
                disableNext={!users.links.next}
                onClickPrevious={(e) => router.get(users.links.prev ?? "")}
                onClickNext={(e) => router.get(users.links.next ?? "")}
            ></Paginator>)}

            <Creator className="mt-3 absolute bottom-0"></Creator>

            <Modal
                show={openModal}
                onClose={toggleProductModal}
            >
                <div className="overflow-y-auto">
                    <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 uppercase">user</div>
                    
                    <div className="mt-4 w-full">
                        <Alert
                            show={errors.failed || success}
                            type={success ? "success" : "failed"}
                            onDisappear={() => {
                                if (errors.failed) setErrors({failed: null})
                                if (action == "delete" && !modalData.id) setOpenModal(false)
                            }}
                        >{success ?? errors.failed}</Alert>
                        {(processing || searching) && (<div className={`w-full text-center flex rounded-full mt-4 mb-2 justify-center items-center ${action != "delete" ? "text-green-600" : "text-red-600"}`}>
                            <div className={`mr-2 animate-ping w-3 h-3 ${action != "delete" ? "bg-green-400" : "bg-red-400"}`}></div> {searching ? "searching" : action == "delete" ? "deleting" : "updating"}...
                        </div>)}
                    </div>
                    {action != "delete" && (<div className="flex justify-start items-center overflow-x-auto px-5 relative">
                        <div className="mt-4 flex justify-end max-w-[60%] items-center mx-4 shrink-0 bg-gray-50 p-2 rounded w-full">
                            {canAssign && <Back
                                onClick={()=> setOpenModal(false)}
                                title="go back"
                                className="cursor-pointer text-gray-600 font-semibold absolute top-0 bg-gray-200 p-2 rounded-full"></Back>}
                            <div className="mx-5 w-full text-center">
                                <div className="text-sm text-gray-600">
                                    <div className="text-lg text-gray-800 font-semibold mt-4 text-center mb-4 capitalize">{modalData.name}</div>
                                    <div className="mb-2 font-semibold">{modalData.email}</div>
                                </div>
                                <div className="flex justify-center">
                                    <ProfilePicture
                                        size={48}
                                        name={modalData.name}
                                        src={modalData.src}
                                        className='mr-2 h-48 w-48'
                                        rounded={false}
                                    ></ProfilePicture>
                                </div>
                            </div>
                        </div>

                        <form encType="multipart/form-data" className="mx-auto p-2 min-w-md shrink-0" onSubmit={submit}>
                        {canAssign && (
                        <>
                            <div className="mt-4 bg-gray-50 p-2 mb-2 text-sm text-gray-600 text-center rounded">
                                <div className="">assignable permissions</div>
                                <div className="my-2 flex w-full max-w-md overflow-y-auto">
                                    {permissions.length ? permissions.map((permission) => 
                                        <PermissionBadge
                                            onDblClick={(perm) => {
                                                if (addedPermissions.find(value => value.id == perm.id)) return
                                                if (existingPermissions.find(value => value.id == perm.id)) return
                                                if (removedPermissions.find(value => value.id == perm.id)) return
                                                setAddedPermissions((ap) => [...ap, perm])
                                            }}
                                            title={`double click on permission to add to user`}
                                            className='m-2 shrink-0' key={permission.id} permission={permission}></PermissionBadge>
                                    ) : <div className="min-h-[50px] flex justify-center items-center w-full">getting permissions...</div>}
                                </div>
                            </div>

                            <div className="mt-4 bg-gray-50 p-2 mb-2 text-sm text-gray-600 text-center rounded">
                                <div className="">existing permissions</div>
                                <div className="my-2 flex w-full max-w-md flex-wrap">
                                    {existingPermissions.length ? existingPermissions.map((permission) => 
                                        <PermissionBadge 
                                            onClose={(perm) => {
                                                setExistingPermissions((ep) => ep.filter(value => value.id != perm.id))
                                                setRemovedPermissions((rp) => [...rp, perm])
                                            }}
                                            className='m-2' key={permission.id} permission={permission}></PermissionBadge>
                                    ) : <div className="p-4 flex justify-center items-center w-full">no existing permissions</div>}
                                </div>
                            </div>

                            <div className="mt-4 bg-gray-50 p-2 mb-2 text-sm text-gray-600 text-center rounded">
                                <div className="">removed permissions</div>
                                <div className="my-2 flex w-full max-w-md flex-wrap">
                                    {removedPermissions.length ? removedPermissions.map((permission) => 
                                        <PermissionBadge
                                            onAdd={(perm) => {
                                                setRemovedPermissions((rp) => rp.filter(value => value.id != perm.id))
                                                setExistingPermissions((ep) => [...ep, perm])
                                            }}
                                            className='m-2' key={permission.id} permission={permission}></PermissionBadge>
                                    ) : <div className="p-4 flex justify-center items-center w-full">no removed permissions</div>}
                                </div>
                            </div>

                            <div className="mt-4 bg-gray-50 p-2 mb-2 text-sm text-gray-600 text-center rounded">
                                <div className="">added permissions</div>
                                <div className="my-2 flex w-full max-w-md flex-wrap">
                                    {addedPermissions.length ? addedPermissions.map((permission) => 
                                        <PermissionBadge
                                            onClose={(perm) => {
                                                setAddedPermissions((ap) => ap.filter(value => value.id != perm.id))
                                            }}
                                            className='m-2' key={permission.id} permission={permission}></PermissionBadge>
                                    ) : <div className="p-4 flex justify-center items-center w-full">no added permissions</div>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                
                                <PrimaryButton className="ml-4 mb-4" 
                                    disabled={processing || !(!!addedPermissions.length || !!removedPermissions.length)}
                                    onClick={syncPermissions}
                                >
                                    assign permissions
                                </PrimaryButton>
                            </div>
                        </>)}
                        </form>

                        {can(auth.user?.data, "manage", "users") && <div>
                            <div>activities section</div>
                        </div>} 
                        {/* TODO */}
                    </div>)}
                    {action == "delete" && (
                        <div className="mx-auto w-4/5 text-center mb-3">
                            <div className="text-gray-600">Are you sure you want to delete account belonging to <span className="capitalize font-semibold">{modalData.name}</span></div>
                            <p className="text-sm text-red-400 my-2">Once the account is deleted, all of its resources and data will be permanently deleted.</p>
                            <div className="flex justify-between items-center mt-3">
                                <PrimaryButton 
                                    disabled={processing} onClick={() => setOpenModal(false)}>cancel</PrimaryButton>
                                <DeleteButton 
                                    disabled={processing}
                                    onClick={deleteUser}>delete</DeleteButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
