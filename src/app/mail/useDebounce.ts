import { useState, useEffect, useCallback, useRef } from 'react';

function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateDebouncedValue = useCallback(
        (newValue : number) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setDebouncedValue(newValue);
            }, delay);
        },
        [delay]
    );

    useEffect(() => {
        updateDebouncedValue(value);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, updateDebouncedValue]);

    return debouncedValue;
}

export default useDebounce;
