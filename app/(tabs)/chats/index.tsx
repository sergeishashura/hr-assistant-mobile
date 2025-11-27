import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  TextInput,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { createChat, getAllChats } from "@/src/store/chats/actions";
import { chatsSelectors } from "@/src/store/chats/chatsSlice";
import { formatUnix } from "@/src/utils";

export default function ChatsScreen() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              color: theme.colors.onBackground,
              fontWeight: "700",
            }}
          >
            Chats
          </Text>

          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={{ borderRadius: 6 }}
          >
            + chat
          </Button>
        </View>

        <FlatList
          data={chats.items || []}
          keyExtractor={(item) => item.id.toString()}
          refreshing={chats.loading}
          onRefresh={() => dispatch(getAllChats())}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: theme.colors.surfaceVariant,
              }}
            />
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}`)}
              style={({ pressed }) => ({
                paddingVertical: 14,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.onBackground }}
                >
                  {item.title || "empty"}
                </Text>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {formatUnix(item.updated_at)}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: theme.colors.surface,
              padding: 20,
              borderRadius: 12,
              marginHorizontal: 20,
              elevation: 4,
            }}
          >
            <Text
              variant="titleLarge"
              style={{
                marginBottom: 16,
                color: theme.colors.onSurface,
                fontWeight: "600",
              }}
            >
              New chat
            </Text>

            <TextInput
              mode="outlined"
              label="Name"
              value={title}
              onChangeText={setTitle}
              textColor={theme.colors.onSurface}
              style={{ marginBottom: 16 }}
            />

            <Button
              mode="contained"
              onPress={handleCreateChat}
              disabled={!title.trim()}
            >
              Create
            </Button>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
}
