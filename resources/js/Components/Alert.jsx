import CheckCircle from "@/Icons/CheckCircle";
import XCircle from "@/Icons/XCircle";
import { Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export default function Alert({children, show = false, closeable = true, type = "success", timing = 2000, onDisappear = () => {} }) {

    let [appear, setAppear] = useState(false)

    useEffect(() => {
        if (show) setAppear(true)

        let timer = setTimeout(() => {
            setAppear(false)
            onDisappear()
        }, timing);
        
        return () => {
            clearTimeout(timer)
        }
    }, [show])

    return (
        <Transition show={appear} as={Fragment} leave="duration-200">
            <div>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
                <div className={`rounded md:rounded-lg p-2 mb-2 mt-4 mx-2 sm:max-w-xl sm:mx-auto flex items-center justify-start 
                    ${type == "success" && "bg-green-300 text-green-800"}
                    ${type == "failed" && "bg-red-300 text-red-800"}
                `}>
                    { type == "success" &&
                            (<CheckCircle className="cursor-pointer text-green-950 mr-2"></CheckCircle>)}
                    { type == "failed" &&
                            (<XCircle className="cursor-pointer text-red-950 mr-2"></XCircle>)}
                    {children}
                    
                </div>
            </Transition.Child>
            </div>
        </Transition>
    )
}