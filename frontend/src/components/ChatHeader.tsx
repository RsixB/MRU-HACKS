import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DEFAULT_PROFILE from "../../assets/images/DEFAULT_PROFILE_PICTURE.jpg"

type ChatHeaderProps = {
  username: string;
  avatar: string;
  onBack: () => void;
  onPressProfile: () => void
};

export function ChatHeader({ username, avatar, onBack, onPressProfile }: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

    
      <Pressable onPress={onPressProfile} style={styles.profileWrapper}>
        <Image 
        source={
          avatar ? {uri : avatar} :
          DEFAULT_PROFILE
        }         
        style={styles.avatar} />

        {/* Username */}
        <Text style={styles.username}>{username}</Text>
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(16,16,16)', // subtle divider
    backgroundColor: 'rgb(16,16,16)'
  },
  backButton: {
    padding: 6,
  },
  // NEW STYLE: Apply row direction and center items for the pressable container
  profileWrapper: {
    flexDirection: "row", // Key fix: Lays children out horizontally
    alignItems: "center", // Vertically centers the avatar and text
    flex: 1, // Optional: Makes it take up available space, pushing content right
    marginLeft: 12, // Adjust spacing from back button
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // Removed margin left/right here, spacing is now managed by profileWrapper
    // We only need a small gap between the avatar and username
    marginRight: 12, 
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});