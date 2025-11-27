import { createAsyncThunk } from "@reduxjs/toolkit";

import { CHAT_URL, CREATE_CHAT_URL } from "@/src/constans/api";
import { ResponseError } from "@/src/types";
import {
  AnswerPayload,
  Chat,
  EvaluationResponse,
  Message,
} from "@/src/types/chat";
import { apiClient } from "@/src/utils";
import { ROLES } from "@/src/constans/roles";
import { chatsActions } from "./chatsSlice";
import { buildHrMessage } from "@/src/utils/buildMessage";

export const getAllChats = createAsyncThunk<
  Chat[],
  void,
  { rejectValue: ResponseError }
>("chats/getAllChats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<Chat[]>(CHAT_URL);

    return data;
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

export const createChat = createAsyncThunk<
  Chat,
  { title: string },
  { rejectValue: ResponseError }
>("chats/create", async ({ title }, { rejectWithValue }) => {
  try {
    const res = await apiClient.post<Chat>(CREATE_CHAT_URL, { title });
    return res.data;
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

export const getChatDetails = createAsyncThunk<
  Chat,
  { ID: number },
  { rejectValue: ResponseError }
>("chats/getChatDetails", async ({ ID }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<Chat>(`${CHAT_URL}/${ID}`);

    return data;
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

export const getChatHistory = createAsyncThunk<
  Message[],
  { ID: number },
  { rejectValue: ResponseError }
>("chats/getChatHistory", async ({ ID }, { rejectWithValue }) => {
  try {
    const res = await apiClient.get<Message[]>(`${CHAT_URL}/${ID}/history`);

    const cleanedMessages = res.data
      .filter((message) => message.role !== ROLES.MODEL)
      .map((message) => {
        if (message.role === ROLES.SYSTEM) {
          try {
            const parsed = JSON.parse(message.text);
            const finalComment = parsed?.llm_evaluation?.final_comment;

            return {
              ...message,
              text: finalComment ?? "No final comment available",
            };
          } catch {
            return {
              ...message,
              text: "Invalid evaluation format",
            };
          }
        }

        return message;
      });

    return cleanedMessages;
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

export const getQuestion = createAsyncThunk<
  Message,
  { ID: number },
  { rejectValue: ResponseError }
>("chats/getQuestion", async ({ ID }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<Message>(`${CHAT_URL}/${ID}/question`);

    dispatch(chatsActions.addMessage(data));

    return data;
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

export const answerChat = createAsyncThunk<
  EvaluationResponse,
  AnswerPayload,
  { rejectValue: { message: string; status?: number } }
>(
  "chats/answerChat",
  async ({ chatId, question, user_answer }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(
        chatsActions.addMessage({
          role: ROLES.USER,
          text: user_answer,
          id: Date.now(),
        })
      );

      const { data } = await apiClient.post<EvaluationResponse>(
        `/chat/${chatId}/answer`,
        { question, user_answer }
      );

      dispatch(
        chatsActions.addMessage({
          role: ROLES.SYSTEM,
          text: buildHrMessage(data),
          id: data.id,
        })
      );

      return data;
    } catch (err: any) {
      return rejectWithValue({
        message: err.response?.data?.message || "Ошибка при отправке ответа",
        status: err.response?.status,
      });
    }
  }
);
