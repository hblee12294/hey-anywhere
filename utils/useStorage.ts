import { useEffect, useState } from "react";
import { WxtStorageItem } from "#imports";

export function useStorage<T>(
  item: WxtStorageItem<T, any>
): [T | null, (value: T) => Promise<void>] {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    let unwatch: (() => void) | undefined;

    item.getValue().then(setValue);
    
    // Handle both sync and async watch returns
    const watchResult = item.watch(setValue);
    if (watchResult instanceof Promise) {
      watchResult.then((u) => {
        unwatch = u;
      });
    } else {
      unwatch = watchResult;
    }

    return () => {
      if (unwatch) {
        unwatch();
      }
    };
  }, [item]);

  const setStorageValue = async (newValue: T) => {
    await item.setValue(newValue);
    setValue(newValue);
  };

  return [value, setStorageValue];
}
