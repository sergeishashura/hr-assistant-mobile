import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  answerChat,
  getChatDetails,
  getChatHistory,
  getQuestion,
} from "@/src/store/chats/actions";
import { chatsSelectors } from "@/src/store/chats/chatsSlice";
import { Message } from "@/src/types/chat";
import { ROLES } from "@/src/constans/roles";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chatId = Number(id);

  const dispatch = useAppDispatch();
  const {
    chatHistory: { items: chatHistory = [] },
    chatDetails: { item: chatDetails },
    question: { item: question, loading: questionLoading },
  } = useAppSelector(chatsSelectors.getSlice);

  const [answer, setAnswer] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatId) {
      dispatch(getChatHistory({ ID: chatId }));
      dispatch(getChatDetails({ ID: chatId }));
    }
  }, [chatId]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!answer.trim() || !question) return;

    await dispatch(
      answerChat({
        chatId,
        question: question.text,
        user_answer: answer.trim(),
      })
    );

    setAnswer("");
  };

  const handleGetQuestion = async () => {
    await dispatch(getQuestion({ ID: chatId }));
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === ROLES.USER;
    const isModel = item.role === ROLES.MODEL;
    const isQuestion = item.role === ROLES.QUESTION;
    const isSystem = item.role === ROLES.SYSTEM;

    return (
      <View
        style={{
          marginVertical: 6,
          maxWidth: "80%",
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser
            ? "#DCF8C6"
            : isModel
            ? "#E8EAF6"
            : isQuestion
            ? "#FFF8E1"
            : "#F5F5F5",
          padding: 10,
          borderRadius: 10,
          opacity: isSystem ? 0.5 : 1,
        }}
      >
        <Text style={{ fontSize: 15 }}>
          {isSystem ? "⚙️ " : ""}
          {item.text}
        </Text>
      </View>
    );
  };

  const lastMessage = chatHistory[chatHistory.length - 1];
  const showQuestionButton =
    (lastMessage && lastMessage.role === ROLES.SYSTEM && !questionLoading) ||
    chatHistory.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80} // чтобы не налегало на input
      >
        {/* HEADER */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            {chatDetails?.title || "Без названия"}
          </Text>
        </View>

        {/* CHAT LIST */}
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 16 }}
        />

        {/* КНОПКА "ПОЛУЧИТЬ ВОПРОС" */}
        {showQuestionButton && (
          <View
            style={{
              position: "absolute",
              bottom: 110,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={handleGetQuestion}
              style={{
                backgroundColor: "#0066FF",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Получить вопрос
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* INPUT BAR */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 12,
            flexDirection: "row",
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#eee",
          }}
        >
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder="Введите ответ..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          />

          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: "#0066FF",
              marginLeft: 8,
              paddingHorizontal: 16,
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
