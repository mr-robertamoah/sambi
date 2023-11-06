import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextBox({ className = '', isFocused = false, ...props }, ref) {
    const textbox = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            textbox.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={textbox}
        ></textarea>
    );
});
