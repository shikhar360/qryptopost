import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
