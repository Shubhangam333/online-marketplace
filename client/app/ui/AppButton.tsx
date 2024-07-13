import colors from "@utils/colors";
import { FC, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  title: string;
  active?: boolean;
  onPress?(): void;
}

const AppButton: FC<Props> = ({ title, active = true, onPress }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, active ? styles.btnActive : styles.btndeActive]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  btndeActive: {
    backgroundColor: colors.deActive,
  },
  title: {
    color: colors.white,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default AppButton;
