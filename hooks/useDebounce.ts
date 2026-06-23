import { useEffect, useRef } from "react";

export const useDebounce = (callback: Function, delay: number) => {
  let timeoutIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedFunction = (...args: any[]) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return { debouncedFunction, timeoutIdRef };
};
