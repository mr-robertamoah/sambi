import { router } from "@inertiajs/react";
import ActionButton from "./ActionButton";
import ProfilePicture from "./ProfilePicture";
import Paginator from "./Paginator";

export default function Table({
    heading, cols, data, actions, hasAddedBy = true,
    rowDataKeys, links, strips, children,
    rowClassName, rowIdx, scrollable, disableActions
}) {
    
    function isEven(num) {
        return num % 2 == 0
    }

    return (
        <div className="w-full">
            
            <table className="table-auto bg-white rounded p-2 border-collapse w-full">
                <thead>
                    {(scrollable && scrollable.current?.scrollWidth > scrollable.current?.clientWidth) && <tr><th colSpan="100%">
                        <div className="flex justify-between items-center w-full">
                            <div 
                                className="text-sm text-gray-600 cursor-pointer transition hover:text-gray-800 p-2 mx-3"
                                onClick={() => {
                                    scrollable.current.scroll({left: scrollable.current.scrollWidth, behavior: "smooth"})
                                }}
                            >scroll right</div>
                            <div
                                className="text-sm text-gray-600 cursor-pointer transition hover:text-gray-800 p-2 mx-3"
                                onClick={() => {
                                    scrollable.current.scroll({left: - scrollable.current.scrollWidth, behavior: "smooth"})
                                }}
                            >scroll left</div>
                        </div>
                    </th></tr>}
                    {children && <tr className="bg-slate-600 rounded-t text-center text-white font-bold uppercase border-b-2 border-white border">
                        <th colSpan="100%"
                            className="bg-slate-600 rounded-t w-full p-2 text-center text-white font-bold"
                        >{children}</th>
                    </tr>}
                    {heading && <tr className={`bg-slate-600 text-center text-white font-bold uppercase border-b-2 border-white border`}>
                        <th colSpan="100%"
                            className={`bg-slate-600 w-full py-4 text-center text-white font-bold` + (children ? "" : "rounded-t")}
                        >{heading}</th>
                    </tr>}
                    <tr className="rounded-bl bg-slate-600 rounded py-4 text-sm text-white capitalize">
                        {hasAddedBy && <th className="py-4 my-2 min-h-[20px]">Added By</th>}
                            {cols?.length ?
                                cols.map((col, idx) => <th key={idx} className={"py-4 my-2 min-h-[20px] " + idx == cols.length - 1 ? "rounded-br" : ""}>{col}</th>) :
                                <th className="py-4 my-2 min-h-[20px]" colSpan={cols.length}>no columns</th>}
                    </tr>
                </thead>
                <tbody>
                    {data?.length ? data.map((item, index) => <tr 
                        className={(strips && isEven(index + 1) ? "bg-slate-100 " : "") + ` text-sm font-normal table-row border-b-2 whitespace-nowrap overflow-x-auto`} key={index + 1}>
                        { hasAddedBy && <td className="font-normal py-4 px-2 border-r-2 min-h-[20px] whitespace-nowrap">
                            <div className="flex justify-start w-full items-center">
                                    <ProfilePicture
                                    src={item.user.image?.src}
                                    className='mr-2 w-8 h-8 shrink-0'
                                    size={8}
                                    showDefaultText={false}
                                ></ProfilePicture>
                                <div>{item.user.name}</div>
                            </div>
                        </td>}
                        {rowDataKeys?.length && rowDataKeys.map((key, idx) => 
                            <td 
                                key={idx} 
                                className={`font-normal py-4 px-2 border-r-2 min-h-[20px] min-w-[50px] whitespace-nowrap ` + (rowIdx?.includes(idx) && rowClassName ? rowClassName : "")}
                            >{typeof key == "function" ? key(item) : _.get(item, key)}</td>)}
                        {item.createdAt && <td className="border-r-2">
                            <div className="font-normal whitespace-nowrap text-center">{item.createdAt}</div>
                        </td>}
                        {actions && <td className="text-center">
                            {actions.length ? actions.map(action => <ActionButton key={`${action.text}${item.id}`}
                                onClick={() => action.func(item)}
                                className={action.className + " mx-3"}
                                disabled={disableActions(item) || action.disabled(item)}
                            >{action.text}</ActionButton>) : <div className="text-sm text-gray-600 mx-2 text-center">no actions</div>}
                        </td>}
                    </tr>) :
                    <tr>
                        <td colSpan="100%" className="h-[20px] py-4 px-2 col-span-3 text-center">not item</td>
                    </tr>}
                    <tr>
                        <td colSpan="100%">
                            <div className="w-[50%] mx-auto">
                                {links && (<Paginator
                                    className="my-2"
                                    disablePrevious={!links.prev}
                                    disableNext={!links.next}
                                    onClickPrevious={(e) => router.get(links.prev ?? "")}
                                    onClickNext={(e) => router.get(links.next ?? "")}
                                ></Paginator>)}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}