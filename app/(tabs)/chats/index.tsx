import { router } from "expo-router";
import { Text } from "react-native";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, TextInput } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { createChat, getAllChats } from "@/src/store/chats/actions";
import { chatsSelectors } from "@/src/store/chats/chatsSlice";
import { formatUnix } from "@/src/utils";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsScreen() {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector(chatsSelectors.getSlice);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(getAllChats());
  }, []);

  const handleCreateChat = async () => {
    const res = await dispatch(createChat({ title: title.trim() }));

    if (createChat.fulfilled.match(res)) {
      setModalVisible(false);
      setTitle("");
      dispatch(getAllChats());
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "700" }}>Чаты</Text>

          <Button mode="contained" onPress={() => setModalVisible(true)}>
            + Новый
          </Button>
        </View>

        <FlatList
          data={chats.items || []}
          keyExtractor={(item) => item.id.toString()}
          refreshing={chats.loading}
          onRefresh={() => dispatch(getAllChats())}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/chat/${item.id}`)}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  {item.title || "Без названия"}
                </Text>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, color: "#777" }}>
                    создан: {formatUnix(item.created_at)}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#777" }}>
                    обновлён: {formatUnix(item.updated_at)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 12,
              marginHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 12 }}>Новый чат</Text>

            <TextInput
              mode="outlined"
              label="Название"
              value={title}
              onChangeText={setTitle}
              style={{ marginBottom: 16 }}
            />

            <Button
              mode="contained"
              onPress={handleCreateChat}
              disabled={!title.trim()}
            >
              Создать
            </Button>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
}
