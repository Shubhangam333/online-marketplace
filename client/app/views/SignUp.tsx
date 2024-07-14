import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "app/ui/WelcomeHeader";
import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { newUserSchema, yupValidate } from "@utils/validator";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import client from "app/api/client";
import useAuth from "app/hooks/useAuth";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const { navigate } =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();
  const { name, email, password } = userInfo;

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({ ...userInfo, [name]: text });
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);

    if (error) {
      return showMessage({ message: error, type: "danger" });
    }
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", values)
    );

    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      signIn(values!);
    }

    setBusy(false);
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            value={name}
            onChangeText={handleChange("name")}
          />
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={handleChange("password")}
          />

          <AppButton active={!busy} title="Sign Up" onPress={handleSubmit} />

          <FormDivider />

          <FormNavigator
            onLeftPress={() => navigate("ForgetPassword")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Forget Password"
            rightTitle="Sign In"
          />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    flex: 1,
  },
  formContainer: {
    marginTop: 30,
  },
});

export default SignUp;
