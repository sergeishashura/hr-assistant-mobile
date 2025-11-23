import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { SecureStorage } from "@/src/utils";
import { SecureStoreKeys } from "@/src/constans/storageKeys";

export default function Index() {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await SecureStorage.get(SecureStoreKeys.ACCESS_TOKEN);
      setToken(storedToken);
    };

    checkToken();
  }, []);

  if (token === undefined) {
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

  if (token) {
    return <Redirect href="/chats" />;
  }

  return <Redirect href="/login" />;
}
