import { Stack, Slot, router } from "expo-router";
import {
  View,
  TouchableOpacity,
  Text,
  BackHandler,
  Platform,
} from "react-native";

export default function TabsLayout() {
  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Slot />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 18 }}>← Назад</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleExit}>
          <Text style={{ fontSize: 18, color: "red" }}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
