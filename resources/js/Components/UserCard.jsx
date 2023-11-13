import DeleteButton from "./DeleteButton"
import Image from "./Image"
import ProfilePicture from "./ProfilePicture"

export default function UserCard({onDblClick = null, user, onDelete = null, ...props}) {

    if (!user) {
        return (<></>)
    }

    function clicked(event) {
        if (event.detail == 2 && onDblClick) {
            onDblClick(event)
        }
    }

    function deleteUser(event) {
        event.preventDefault()
        if (onDelete) {
            onDelete(user)
        }
    }

    return (
        <div className="bg-white mx-auto p-4 rounded sm:rounded-lg relative cursor-pointer select-none">
            <div onClick={clicked} {...props}>
                <div className="flex justify-start items-start w-full h-28">
                    <ProfilePicture
                                size={28}
                                name={user.name}
                                src={user.image?.src}
                                className='mr-2 h-28 w-28'
                            ></ProfilePicture>
                    <div className="relative mt-6 mx-1 w-full">
                        <div className="text-gray-900 uppercase font-semibold text-center">{user.name}</div>
                    </div>
                    
                </div>
                <p className="text-center text-gray-600 text-sm py-2">{user.email}</p>
                <div className="absolute top-1 right-1 mt-2 mr-2 text-end text-gray-600 text-sm">{user.permissions.length} permission{user.permissions.length == 1 ? "" : "s"}</div>
            </div>
            {onDelete && <div className="flex justify-end text-sm my-2 mr-2">
                <DeleteButton title={`delete ${user.name} user`} onClick={deleteUser}>delete</DeleteButton>
            </div>}
        </div>
    )
}