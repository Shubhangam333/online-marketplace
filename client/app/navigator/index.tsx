import { FC } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import colors from "@utils/colors";
import AuthNavigator from "app/navigator/AuthNavigator";
import AppNavigator from "app/navigator/AppNavigator";

interface Props {}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.white,
  },
};

const Navigator: FC<Props> = (props) => {
  const loggedIn = false;

  return (
    <NavigationContainer theme={MyTheme}>
      {!loggedIn ? <AuthNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Navigator;
