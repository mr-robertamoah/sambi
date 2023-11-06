import { forwardRef, useEffect, useRef } from 'react';
import { useState } from 'react';
import Image from './Image';

export default forwardRef(function FileInput({ src = null, defaultButtonText = "upload file", defaultFilename = "no file", clearName = false, onDelete = null, onChange, getFileOnDelete = false}, ref) {
    const input = ref ? ref : useRef();
    let [fileName, setFileName] = useState()

    useEffect(() => {
        if (clearName) {
            setFileName(null);
        }
    }, []);

    function getFile(event) {
        event.preventDefault()
        input.current.click();
    }

    function deleteFile(event) {
        setFileName(null)
        onDelete(event)
        if (getFileOnDelete) 
            input.current.click();
    }

    function change(event) {

        if (event.target.files.length)
            setFileName(event.target.files[0].name)
        onChange(event)
    }

    return (
        <>
            <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={input}
                onInput={change}
            />
            <div className="flex items-center">
                {!src && (<button className='inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white lowercase tracking-widest hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150'
                    onClick={getFile}>{defaultButtonText}</button>)}
                
            </div>

            {src && (<div className="block mt-4 w-1/2 mx-auto text-center bg-gray-400 max-h-40 relative">
                <Image
                    className="h-40 object-contain"
                    src={src}
                    alt={defaultFilename}
                ></Image>
                <div 
                    className={`ml-2 text-sm text-ellipsis bg-gray-600 absolute top-2 right-2 text-white p-2 cursor-pointer rounded`}
                    onClick={(e) => onDelete ? deleteFile(e) : null}
                    title={onDelete ? "click to remove file" : ""}
                >remove {fileName}</div>
            </div>)}
        </>
    );
});
