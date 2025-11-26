import { storage } from "#imports";

export const enableLongPressStorage = storage.defineItem<boolean>(
  "local:enableLongPress",
  {
    defaultValue: true,
  }
);

