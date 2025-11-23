import { SecureStoreKeys } from "../constans/storageKeys";

export type SecureStoreKey =
  (typeof SecureStoreKeys)[keyof typeof SecureStoreKeys];
