import { Slot, router, usePathname } from "expo-router";
import {
  View,
  TouchableOpacity,
  Text,
  BackHandler,
  Platform,
} from "react-native";
import { useTheme } from "react-native-paper";

export default function TabsLayout() {
  const theme = useTheme();
  const pathname = usePathname();

  const isChatsScreen = pathname === "/chats";

  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      router.replace("/login");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Slot />

      <View
        style={{
          flexDirection: "row",
          justifyContent: isChatsScreen ? "flex-end" : "space-between",
          padding: 16,
          borderTopWidth: 1,
          borderColor: theme.colors.surfaceVariant,
          backgroundColor: theme.colors.surface,
        }}
      >
        {!isChatsScreen && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingVertical: 4, paddingHorizontal: 8 }}
          >
            <Text
              style={{
                fontSize: 18,
                color: theme.colors.onSurface,
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleExit}
          style={{ paddingVertical: 4, paddingHorizontal: 8 }}
        >
          <Text
            style={{
              fontSize: 18,
              color: theme.colors.error,
              fontWeight: "600",
            }}
          >
            Exit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
