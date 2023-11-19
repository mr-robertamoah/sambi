import can from "@/Helpers/can"
import DeleteButton from "./DeleteButton"
import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"

export default function CostItemCard({onDblClick = null, costItem, onDelete = null, ...props}) {
    let user = usePage().props.auth.user?.data
    let [canUpdate, setCanUpdate] = useState(false)

    if (!costItem) {
        return (<></>)
    }

    useEffect(() => {
        setCanUpdate(can(user, "update", "costItems", costItem.user))
    }, [])

    function clicked(event) {
        if (event.detail == 2 && onDblClick && canUpdate) {
            onDblClick(event)
        }
    }

    function deleteCostItem(event) {
        event.preventDefault()
        if (onDelete) {
            onDelete(costItem)
        }
    }

    return (
        <div className="bg-white mx-auto p-4 rounded sm:rounded-lg relative cursor-pointer select-none min-w-[200px] max-w-[300px]">
            <div onClick={clicked} {...props} className="w-full h-24" title={`double click to edit ${costItem.name} cost item`}>
                <div className="relative mt-4 mx-2">
                    <div className="text-gray-900 uppercase font-semibold text-center">{costItem.name}</div>
                    <p className="text-gray-600 text-sm py-2">{costItem.description}</p>
                </div>
                <div 
                    className="absolute top-2 right-2 flex text-sm justify-center rounded text-gray-600"
                >{costItem.unitCharge} {costItem.unit}</div>
            </div>
            <div className="text-sm my-2 mr-2 flex justify-between items-start">
                <div className="text-start text-xs text-gray-600 mr-1">
                    <div className="">added by {costItem.user.name}</div>
                    <div>{costItem.createdAt}</div>
                </div>
                {canUpdate && <DeleteButton title={`delete ${costItem.name} cost item`} onClick={deleteCostItem}>delete</DeleteButton>}
            </div>
            
        </div>
    )
}