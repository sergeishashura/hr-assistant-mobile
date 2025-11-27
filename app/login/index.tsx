import { View, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { TextInput, Button, Text, useTheme } from "react-native-paper";

import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { authSelectors } from "@/src/store/auth/authSlice";
import { login } from "@/src/store/auth";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const {
    login: { loading: isLoginLoading, error: loginError },
  } = useAppSelector(authSelectors.getSlice);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const theme = useTheme();

  const onSubmit = async (data: LoginFormData) => {
    const res = await dispatch(login(data));
    if (login.fulfilled.match(res)) {
      router.replace("/chats");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 28,
            marginBottom: 20,
            textAlign: "center",
            color: theme.colors.onBackground,
          }}
        >
          Вход
        </Text>

        <TextInput
          label="Username"
          mode="outlined"
          textColor={theme.colors.onSurface}
          onChangeText={(t) => setValue("username", t)}
          style={{ marginBottom: 12 }}
          error={!!errors.username}
        />

        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          textColor={theme.colors.onSurface}
          onChangeText={(t) => setValue("password", t)}
          style={{ marginBottom: 12 }}
          error={!!errors.password}
        />

        {loginError && (
          <Text
            style={{
              color: theme.colors.error,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {loginError.message}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoginLoading}
        >
          Log in
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
