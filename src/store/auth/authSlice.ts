import { createSlice } from "@reduxjs/toolkit";

import { ResponseError, StoreBase, StoreItem } from "@/src/types";
import { User } from "@/src/types/user";
import { login } from "./actions";

interface AuthState {
  login: StoreBase;
  user: StoreItem<User>;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  login: {
    loading: false,
    error: null,
  },
  user: {
    loading: false,
    error: null,
  },
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.login.loading = true;
      state.login.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.login.loading = false;
      state.user.item = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.login.loading = false;
      state.login.error = action.payload as ResponseError;
    });
  },
  selectors: {
    getSlice: (sliceState: AuthState) => sliceState,
  },
});

export const {
  reducer: authReducer,
  actions: authActions,
  selectors: authSelectors,
} = authSlice;
