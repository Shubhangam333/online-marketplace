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
import { newUserSchema, signInSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import axios from "axios";
import client from "app/api/client";
import { useDispatch } from "react-redux";
import { updateAuthState } from "app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "app/hooks/useAuth";

interface Props {}

const SignIn: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { signIn } = useAuth();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({ ...userInfo, [name]: text });
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);

    if (error) {
      return showMessage({ message: error, type: "danger" });
    }

    if (values) {
      signIn(values);
    }
  };

  const { email, password } = userInfo;

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />

          <AppButton title="Sign In" onPress={handleSubmit} />

          <FormDivider />

          <FormNavigator
            onLeftPress={() => navigate("ForgetPassword")}
            onRightPress={() => navigate("SignUp")}
            leftTitle="Forget Password"
            rightTitle="Sign Up"
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

export default SignIn;
