import can from "@/Helpers/can"
import DeleteButton from "./DeleteButton"
import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"

export default function PermissionCard({
    onDblClick = null, permission, deleteDisabled, deleteText = "delete",
    onDelete = null, title = "", deleteTitle = "", className = "", ...props
}) {
    if (!permission) {
        return (<></>)
    }

    function clicked(event) {
        if (event.detail == 2 && onDblClick && canUpdate) {
            onDblClick(event)
        }
    }

    function deletePermission(event) {
        event.preventDefault()
        if (onDelete) {
            onDelete(permission)
        }
    }

    return (
        <div className={className + ` bg-white border-2 border-gray-200 p-4 rounded sm:rounded-lg relative cursor-pointer select-none min-w-[200px] max-w-[300px] `}>
            <div onClick={clicked} {...props} className="w-full" title={title}>
                <div className="relative mt-4 mx-2">
                    <div className="text-gray-900 uppercase font-semibold text-center">{permission.name}</div>
                    <p className="text-gray-600 text-sm py-2">{permission.description}</p>
                </div>
            </div>
            <div className="text-sm my-2 mr-2 flex justify-between items-start">
                <div className="text-start text-xs text-gray-600 mr-1">
                    <div className="">assigned by {permission.assignedBy}</div>
                    <div>{permission.assignedOn}</div>
                </div>
                <DeleteButton
                    title={deleteTitle}
                    disabled={deleteDisabled}
                    onClick={deletePermission}
                >{deleteText}</DeleteButton>
            </div>
        </div>
    )
}