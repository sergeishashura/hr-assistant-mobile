import { combineReducers, configureStore, Action } from "@reduxjs/toolkit";

import {
  authReducer,
  initialState as authInitialState,
} from "./auth/authSlice";
import { ResponseError } from "../types";

import reactotron from "../../reactotron.config";
import { chatsReducer } from "./chats";

const appReducer = combineReducers({
  auth: authReducer,
  chats: chatsReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Action
) => {
  if (action.type === "auth/logout/pending") {
    return appReducer(
      {
        auth: {
          ...authInitialState,
          isAuthenticated: false,
        },
      },
      action
    );
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  enhancers: (getDefaultEnhancers) => {
    const defaultEnhancers = getDefaultEnhancers();
    return __DEV__
      ? ([
          ...defaultEnhancers,
          reactotron.createEnhancer(),
        ] as typeof defaultEnhancers)
      : defaultEnhancers;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ThunkConfig {
  rejectValue: ResponseError | string;
  state: RootState;
}
