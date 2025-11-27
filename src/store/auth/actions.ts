import { createAsyncThunk } from "@reduxjs/toolkit";

import { LoginPayload, LoginResponse, ResponseError } from "@/src/types";
import { apiClient } from "@/src/utils/apiClient";
import { LOGIN_URL } from "@/src/constans/api";
import { SecureStorage } from "@/src/utils";
import { SecureStoreKeys } from "@/src/constans/storageKeys";

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: ResponseError }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<LoginResponse>(LOGIN_URL, {
      username,
      password,
    });

    await SecureStorage.set(
      SecureStoreKeys.ACCESS_TOKEN,
      response.data.access_token
    );

    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || {
        message: err.message,
        error: "Network Error",
        statusCode: 0,
      }
    );
  }
});
