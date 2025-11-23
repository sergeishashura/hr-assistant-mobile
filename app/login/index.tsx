import { View } from "react-native";
import { useForm } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";

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
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {

    console.log("data" , data);
    const res = await dispatch(login(data));

    if (login.fulfilled.match(res)) {
      router.replace("/chats");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 20, textAlign: "center" }}>
        Вход
      </Text>

      <TextInput
        label="Username"
        mode="outlined"
        onChangeText={(t) => setValue("username", t)}
        style={{ marginBottom: 12 }}
        error={!!errors.username}
      />

      <TextInput
        label="Пароль"
        mode="outlined"
        secureTextEntry
        onChangeText={(t) => setValue("password", t)}
        style={{ marginBottom: 12 }}
        error={!!errors.password}
      />

      {loginError && (
        <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
          {loginError.message}
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isLoginLoading}
      >
        Войти
      </Button>
    </View>
  );
}
