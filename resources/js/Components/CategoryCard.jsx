import DeleteButton from "./DeleteButton"
import Image from "./Image"

export default function CategoryCard({onDblClick = null, category, onDelete = null, ...props}) {

    if (!category) {
        return (<></>)
    }

    function clicked(event) {
        if (event.detail == 2 && onDblClick) {
            onDblClick(event)
        }
    }

    function deleteCategory(event) {
        event.preventDefault()
        if (onDelete) {
            onDelete(category)
        }
    }

    return (
        <div className="bg-white p-4 rounded sm:rounded-lg relative cursor-pointer select-none min-w-[200px] max-w-[300px]">
            <div onClick={clicked} {...props} className="w-full h-24" title={`double click to edit ${category.name} category`}>
                <div className="relative mt-4 mx-2">
                    <div className="text-gray-900 uppercase font-semibold text-center">{category.name}</div>
                    <p className="text-gray-600 text-sm py-2">{category.description}</p>
                </div>
            </div>
            <div className="absolute bottom-1 right-1 text-sm my-2 mr-2">
                    <DeleteButton title={`delete ${category.name} category`} onClick={deleteCategory}>delete</DeleteButton>
            </div>
        </div>
    )
}