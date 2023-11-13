import getDiscountText from "@/Helpers/getDiscountText"
import DeleteButton from "./DeleteButton"

export default function CostCard({onDblClick = null, discount, onDelete = null, ...props}) {

    if (!discount) {
        return (<></>)
    }

    function clicked(event) {
        if (event.detail == 2 && onDblClick) {
            onDblClick(event)
        }
    }

    function deleteCost(event) {
        event.preventDefault()
        if (onDelete) {
            onDelete(discount)
        }
    }

    return (
        <div className="bg-white mx-auto p-4 rounded sm:rounded-lg relative cursor-pointer select-none min-w-[200px] max-w-[300px]">
            <div onClick={clicked} {...props} className="w-full h-24" title={`double click to edit ${discount.name} discount`}>
                <div className="relative mt-4 mx-2">
                    <div className="text-gray-900 uppercase font-semibold text-center">{discount.name}</div>
                    <p className="text-gray-600 text-sm py-2">{discount.description}</p>
                </div>
                <div 
                    className="absolute top-2 right-2 flex text-sm justify-center rounded text-gray-600"
                >{getDiscountText(discount)}</div>
            </div>
            <div className="text-sm my-2 mr-2 flex justify-between items-start">
                <div className="text-start text-xs text-gray-600 mr-1">
                    <div className="">added by {discount.user.name}</div>
                    <div>{discount.createdAt}</div>
                </div>
                <DeleteButton title={`delete ${discount.name} discount item`} onClick={deleteCost}>delete</DeleteButton>
            </div>
            
        </div>
    )
}