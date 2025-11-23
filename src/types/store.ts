import { ResponseError } from "./response";

export type StoreBase = {
  loading: boolean;
  error: ResponseError | null;
};

export type StoreItems<T> = StoreBase & { items?: T[] };

export type StoreItem<T> = StoreBase & { item?: T | null };
