import { useRef } from 'react';
// utility for debouncing
export const useDebounce = (cb: Function, delay = 500) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (...args: any) => {
        // clears an existing timeout if any
        if (timer.current) {
            clearTimeout(timer.current);
        }
        // after the preset amount of wait the callback gets executed
        timer.current = setTimeout(() => {
            cb(...args);
        }, delay);
    };
};
