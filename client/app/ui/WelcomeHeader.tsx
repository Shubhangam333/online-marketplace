import colors from "@utils/colors";
import { FC } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

interface Props {}

const heading = "Online MarketPlace for Used Goods";
const subHeading =
  "Buy or sell used goods with trust. Chat directly with sellers , ensuring a seamless authentic experience";

const WelcomeHeader: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/ecom.jpg")}
        style={styles.image}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
  heading: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 5,
    color: colors.primary,
  },
  subHeading: {
    fontSize: 12,
    textAlign: "center",
    color: colors.primary,
    lineHeight: 14,
  },
});

export default WelcomeHeader;
