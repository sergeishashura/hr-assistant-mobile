import * as SecureStore from "expo-secure-store";

import { SecureStoreKey } from "../types/storage";

export const SecureStorage = {
  async set(key: SecureStoreKey, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: SecureStoreKey): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async remove(key: SecureStoreKey): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
