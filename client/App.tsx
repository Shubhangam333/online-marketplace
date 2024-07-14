import Navigator from "app/navigator";
import store from "app/store";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position="top" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
