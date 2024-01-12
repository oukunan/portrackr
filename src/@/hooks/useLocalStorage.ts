import { useEffect, useMemo, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<T>] {
  const [value, setValue] = useState(() => {
    try {
      const currentValue = JSON.parse(
        localStorage.getItem(key) ?? String(defaultValue)
      );

      return currentValue;
    } catch (_e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return useMemo(() => [value, setValue], [value, setValue]);
}
