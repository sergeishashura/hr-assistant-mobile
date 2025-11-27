import { createSlice } from "@reduxjs/toolkit";

import { ResponseError, StoreItem, StoreItems } from "@/src/types";
import { Chat, EvaluationResponse, Message } from "@/src/types/chat";
import {
  answerChat,
  createChat,
  getAllChats,
  getChatDetails,
  getChatHistory,
  getQuestion,
} from "./actions";

interface ChatsState {
  chats: StoreItems<Chat>;
  chatDetails: StoreItem<Chat>;
  chatHistory: StoreItems<Message>;
  createChat: StoreItem<Chat>;
  question: StoreItem<Message>;
  modelAnswer: StoreItem<EvaluationResponse>;
}

export const initialState: ChatsState = {
  chats: {
    loading: false,
    error: null,
  },
  chatDetails: {
    loading: false,
    error: null,
  },
  chatHistory: {
    loading: false,
    error: null,
  },
  createChat: {
    loading: false,
    error: null,
  },
  question: {
    loading: false,
    error: null,
  },
  modelAnswer: {
    loading: false,
    error: null,
  },
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addMessage(state, action) {
      if (state.chatHistory.items) {
        state.chatHistory.items = [...state.chatHistory.items, action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllChats.pending, (state) => {
      state.chats.loading = true;
      state.chats.error = null;
    });
    builder.addCase(getAllChats.fulfilled, (state, action) => {
      state.chats.loading = false;
      state.chats.items = action.payload;
    });
    builder.addCase(getAllChats.rejected, (state, action) => {
      state.chats.loading = false;
      state.chats.error = action.payload as ResponseError;
    });

    builder.addCase(getChatDetails.pending, (state) => {
      state.chatDetails.loading = true;
      state.chatDetails.error = null;
    });
    builder.addCase(getChatDetails.fulfilled, (state, action) => {
      state.chatDetails.loading = false;
      state.chatDetails.item = action.payload;
    });
    builder.addCase(getChatDetails.rejected, (state, action) => {
      state.chatDetails.loading = false;
      state.chatDetails.error = action.payload as ResponseError;
    });

    builder.addCase(createChat.pending, (state) => {
      state.createChat.loading = true;
      state.createChat.error = null;
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.createChat.loading = false;
      state.createChat.item = action.payload;
    });
    builder.addCase(createChat.rejected, (state, action) => {
      state.createChat.loading = false;
      state.createChat.error = action.payload as ResponseError;
    });

    builder.addCase(getChatHistory.pending, (state) => {
      state.chatHistory.loading = true;
      state.chatHistory.error = null;
    });
    builder.addCase(getChatHistory.fulfilled, (state, action) => {
      state.chatHistory.loading = false;
      state.chatHistory.items = action.payload;
    });
    builder.addCase(getChatHistory.rejected, (state, action) => {
      state.chatHistory.loading = false;
      state.chatHistory.error = action.payload as ResponseError;
    });

    builder.addCase(getQuestion.pending, (state) => {
      state.question.loading = true;
      state.question.error = null;
    });
    builder.addCase(getQuestion.fulfilled, (state, action) => {
      state.question.loading = false;
      state.question.item = action.payload;
    });
    builder.addCase(getQuestion.rejected, (state, action) => {
      state.question.loading = false;
      state.question.error = action.payload as ResponseError;
    });

    builder.addCase(answerChat.pending, (state) => {
      state.modelAnswer.loading = true;
      state.modelAnswer.error = null;
    });
    builder.addCase(answerChat.fulfilled, (state, action) => {
      state.modelAnswer.loading = false;
      state.modelAnswer.item = action.payload;
      state.question.item = null;
    });
    builder.addCase(answerChat.rejected, (state, action) => {
      state.modelAnswer.loading = false;
      state.modelAnswer.error = action.payload as ResponseError;
    });
  },
  selectors: {
    getSlice: (sliceState: ChatsState) => sliceState,
  },
});

export const {
  reducer: chatsReducer,
  actions: chatsActions,
  selectors: chatsSelectors,
} = chatsSlice;
