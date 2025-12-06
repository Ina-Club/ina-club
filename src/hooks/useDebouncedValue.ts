import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // If value changes before delay passes, clear previous timer
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
