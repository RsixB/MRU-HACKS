import {View,Text,FlatList,StyleSheet,Image,Pressable,} from "react-native";
import { useRouter } from "expo-router";
import { useActiveStore } from "@/src/store/active-store";
import DEFAULT_PROFILE_PICTURE from "../../../assets/images/DEFAULT_PROFILE_PICTURE.jpg";
import { useChatStore } from "@/src/store/chat-store";
import { formatTime } from "@/src/utils/timeConverter";



export default function ChatListScreen() {
  const router = useRouter();
  const { sideBar, chatNames } = useChatStore()
  const { setInChat } = useActiveStore();
  return (
    <View style={styles.container}>
      <FlatList
        data={sideBar}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatItem}
            onPress={() => router.push(`/(tabs)/chats/${item.username}`)}
            onPressIn={() => {
              setInChat(true);
            }}
          >
            {/* Avatar */}
            <Image
              source={
                item.profilePicture
                  ? { uri: item.profilePicture }
                  : DEFAULT_PROFILE_PICTURE
              }
              style={styles.avatar}
            />

            {/* Chat details */}
            <View style={styles.chatInfo}>
              {/* Top row: name + time */}
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chatNames[item.name]}</Text>
                {item.timeSent !== null && (
                  <Text style={styles.chatTime}>
                    {formatTime(item.timeSent)}
                  </Text>
                )}
              </View>

              {/* Bottom row: last message + notification */}
              <View style={styles.chatFooter}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.notifications > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>
                      {item.notifications}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(17,17,17)",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  chatTime: {
    color: "#aaa",
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    color: "#ccc",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  notificationBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 5,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
timeText: {
  fontSize: 12,
  color: "gray",
  marginTop: 4,
  alignSelf: "flex-end",
},
});
