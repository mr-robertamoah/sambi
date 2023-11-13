import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function Select({className = '', isFocused = false, options = [], valueKey, optionKey, placeholder, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <select
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        >
            <option className="text-gray-500" value="">{placeholder ?? "select"}</option>
            {
                options.length && options.map((value, index) =>
                <option 
                    key={index + 1}
                    className=""
                    value={valueKey ? value[valueKey] : value["id"]}
                >{optionKey ? value[optionKey] : value["value"]}</option>)
            }
        </select>
    );
});
