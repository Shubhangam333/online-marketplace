import AvatarView from "@ui/AvatarView";
import colors from "@utils/colors";
import size from "@utils/size";
import useAuth from "app/hooks/useAuth";
import { FC } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";

interface Props {}

const Profile: FC<Props> = (props) => {
  const { authState } = useAuth();
  const { profile } = authState;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <AvatarView uri={profile?.avatar} size={80} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: colors.primary,
    paddingTop: 2,
  },
  profileInfo: {
    flex: 1,
    paddingLeft: size.padding,
  },
});

export default Profile;
