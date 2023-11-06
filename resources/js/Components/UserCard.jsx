import DeleteButton from "./DeleteButton"
import Image from "./Image"

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
            onDelete(product)
        }
    }

    return (
        <div className="bg-white p-4 rounded sm:rounded-lg relative cursor-pointer">
            <div onClick={clicked} {...props} className="grid grid-cols-2 w-full h-48" title={`double click to edit ${product.name} product`}>
                {user.image ? <div className="h-full bg-gray-100">
                    <Image className="h-44" src={user.image.src} alt={user.name} />
                </div> : <div className="h-full p-2 bg-gray-400 text-gray-600 flex items-center justify-center">no image</div>}
                <div className="relative mt-4 mx-2">
                    <div className="text-gray-900 uppercase font-semibold text-center">{user.name}</div>
                    <p className="text-gray-600 text-sm py-2">{user.email}</p>
                    <div>{user.permissions.length} permission{user.permissions.length == 1 ? "" : "s"}</div>
                </div>
                <div className="absolute top-2 right-2 flex text-sm justify-center rounded text-gray-600">GHC {user.sellingPrice}</div>
                
            </div>
            <div className="absolute bottom-1 right-1 text-sm my-2 mr-2">
                    <DeleteButton title={`delete ${user.name} user`} onClick={deleteUser}>delete</DeleteButton>
            </div>
        </div>
    )
}