import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  IMessage,
} from "react-native-gifted-chat";
import { useTheme, Text, ActivityIndicator } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  getChatHistory,
  answerChat,
  getChatDetails,
  getQuestion,
} from "@/src/store/chats/actions";
import { chatsSelectors } from "@/src/store/chats/chatsSlice";
import { ROLES } from "@/src/constans/roles";
import { Message } from "@/src/types/chat";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chatId = Number(id);

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const {
    chatDetails: { item: chatDetails, loading: detailsLoading },
    chatHistory: { items: chatHistory = [], loading: historyLoading },
    question: { item: question },
    modelAnswer: { loading: isModelLoading },
  } = useAppSelector(chatsSelectors.getSlice);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const mapMessages = (msgs: Message[]): IMessage[] => {
    return msgs
      .slice()
      .reverse()
      .map((m) => {
        let userId = 4;

        if (m.role === ROLES.USER) userId = 1;
        if (m.role === ROLES.MODEL) userId = 2;
        if (m.role === ROLES.SYSTEM) userId = 3;

        return {
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.created_at ?? Date.now()),
          user: {
            _id: userId,
            name: m.role,
          },
        } satisfies IMessage;
      });
  };

  useEffect(() => {
    if (!chatId) return;

    dispatch(getChatHistory({ ID: chatId })).then((res) => {
      const mapped = mapMessages(res.payload as Message[]);
      setMessages(mapped);
    });

    dispatch(getChatDetails({ ID: chatId }));
  }, [chatId]);

  useEffect(() => {
    setMessages(mapMessages(chatHistory));
  }, [chatHistory]);

  const onSend = async (newMessages: IMessage[] = []) => {
    if (!newMessages.length || !question) return;

    const userMsg = newMessages[0].text;

    setMessages((prev) => GiftedChat.append(prev, newMessages));

    await dispatch(
      answerChat({
        chatId,
        question: question.text,
        user_answer: userMsg,
      })
    );
  };

  const renderBubble = (props: any) => {
    const isUserMessage = props.currentMessage.user._id === 1;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.primaryContainer,
          },
          left: {
            backgroundColor: theme.colors.secondaryContainer,
          },
        }}
        textStyle={{
          right: { color: theme.colors.onPrimaryContainer },
          left: { color: theme.colors.onSecondaryContainer },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopColor: theme.colors.surfaceVariant,
        borderTopWidth: 1,
        backgroundColor: theme.colors.surface,
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      containerStyle={{ justifyContent: "center", marginRight: 10 }}
    >
      <Text style={{ fontSize: 26, color: theme.colors.primary }}>→</Text>
    </Send>
  );

  if (detailsLoading || historyLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: theme.colors.surfaceVariant,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text
          onPress={() => router.back()}
          style={{
            fontSize: 22,
            marginRight: 16,
            color: theme.colors.primary,
          }}
        >
          ←
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: theme.colors.onSurface,
          }}
          numberOfLines={1}
        >
          {chatDetails?.title || "Chat"}
        </Text>
      </View>

      {!question && (
        <View style={{ padding: 16 }}>
          <Text
            onPress={() => dispatch(getQuestion({ ID: chatId }))}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.onPrimary,
              padding: 12,
              borderRadius: 10,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Get Question
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={(msgs) => onSend(msgs)}
          user={{ _id: 1 }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          isTyping={isModelLoading}
          textInputProps={{
            editable: Boolean(question),
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
