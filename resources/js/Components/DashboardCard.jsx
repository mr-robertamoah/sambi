import { router } from "@inertiajs/react";
import PrimaryButton from "./PrimaryButton";

export default function DashboardCard({children, title, cardRoute = "", numberOfEntries = 0, noNumberOfEntries = false}) {
    
    function goTo() {
        router.get(cardRoute)
    }
    return (
        <div href={cardRoute} className="mb-4 max-w-2xl mx-auto w-full px-2 sm:px-6 lg:px-8">
            <div className="bg-white hover:bg-slate-50 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="pt-6 pb-3 flex align-middle items-center w-full justify-between px-2">
                    <div className="text-xl pl-6 text-gray-900 font-bold capitalize">{title}</div>
                    {!noNumberOfEntries && <span className="flex text-gray-700 text-sm items-center align-middle">
                        <div 
                            className="mr-2 bg-slate-800 text-white w-8 flex align-middle items-center justify-center h-8 font-semibold rounded-full"
                        >{numberOfEntries}</div> {numberOfEntries == 1 ? "entry" : "entries"}
                    </span>}
                </div>
                <div className="px-4 text-justify">
                    {children}
                </div>

                <div className="m-3 flex justify-end">
                    <PrimaryButton onClick={goTo}>view</PrimaryButton>
                </div>
            </div>
        </div>
    )
}