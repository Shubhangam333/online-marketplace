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
import * as yup from "yup";
import axios from "axios";
import { newUserSchema, yupValidate } from "@utils/validator";
import { runAxiosAsync } from "app/api/runAxiosAsync";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { navigate } =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { name, email, password } = userInfo;

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({ ...userInfo, [name]: text });
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);
    const res = await runAxiosAsync<{ message: string }>(
      axios.post("http://10.0.2.2:8000/auth/sign-up", values)
    );
    console.log(res);
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

          <AppButton title="Sign Up" onPress={handleSubmit} />

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
