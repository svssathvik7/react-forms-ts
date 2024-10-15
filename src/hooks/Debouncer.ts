import { useRef } from 'react';

export const useDebounce = (cb: Function, delay = 500) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (...args: any) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            cb(...args);
            console.log(args); 
        }, delay);
    };
};
