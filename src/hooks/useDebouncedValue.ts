import { useEffect, useRef } from "react";

const useDebouncedValue = (value: any, debounceInMs: number = 500, afterDebounceHandler: ()=> void) => {
    const timeoutIdRef = useRef<number | null>(null);
    useEffect(() => {
        if(timeoutIdRef.current){
            clearTimeout(timeoutIdRef.current);
        }

        timeoutIdRef.current = setTimeout(() => {
            timeoutIdRef.current = null;
            afterDebounceHandler();
        }, debounceInMs);
    }, [value])
};

export default useDebouncedValue;