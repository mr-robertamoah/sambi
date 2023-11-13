import PlusCircle from "@/Icons/PlusCircle";
import XCircle from "@/Icons/XCircle";

export default function Badge({children, title = null, onDblClick = null, onClose = null, onClick = null, onAdd = null, className=""}) 
{
    function close() {
        if (onClose) onClose()
    }

    function click(e) {
        if (e.detail == 1 && onClick) onClick()
        if (e.detail == 2 && onDblClick) onDblClick()
    }

    function add() {
        if (onAdd) onAdd()
    }

    return (
        <div onClick={click} className={className + ` select-none p-3 text-sm bg-cyan-100 relative rounded-lg ${onDblClick || onClick ? "cursor-pointer " : ""}`}
            title={title ?? ""}
        >
            <div className="">{children}</div>
            {onClose && <XCircle onClick={close} className="absolute -top-3 -right-3 cursor-pointer p-1 min-w-min"></XCircle>}
            {onAdd && <PlusCircle onClick={add} className="absolute -top-3 -right-3 cursor-pointer p-1 min-w-min"></PlusCircle>}
        </div>
    )
}