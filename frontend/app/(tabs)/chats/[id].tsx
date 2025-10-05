import {View,Text,StyleSheet,FlatList,ImageBackground,KeyboardAvoidingView,Platform,} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActiveStore } from "@/src/store/active-store";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/src/components/ChatHeader";
import { ChatTypingArea } from "@/src/components/ChatTypingArea";
import { StatusBar } from "expo-status-bar";
import BACKGROUND_IMAGE from "../../../assets/images/WALL_PAPER.jpg";
import { useChatStore } from "@/src/store/chat-store";
import { useAuthStore } from "@/src/store/auth-store";
import { useTempStore } from "@/src/store/temp-store";
interface ChatMessage {
  username: string;
  message: string;
  createdAt: Date | null;
}

export default function ChatScreen() {
  const { clearData } = useTempStore()
  const { username } = useAuthStore();
  const { chatMessages, chatNames, friends, removeChatNotification } = useChatStore();
  const { setInChat } = useActiveStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const flatListRef = useRef<FlatList<ChatMessage>>(null); 

  useEffect(() => {
    setCurrentMessages(chatMessages[id]);
  }, [chatMessages[id]]);

  useEffect(() => {
    return () => {
      clearData()
    }
  }, [])

  useEffect(() => {
    return () => {
      setInChat(false);
      removeChatNotification(id);
    };
  }, []);

  const currentFriend = friends.find((a) => a.username === id);
  const myUsername = username;

  const onGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#1e88e5" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={5}
      >
        {/* Header */}
        <View style={styles.headerWrapper}>
          <ChatHeader
            username={chatNames[id]}
            avatar={currentFriend ? currentFriend.profilePicture : ""}
            onBack={onGoBack}
            onPressProfile={() => router.push(`/(tabs)/chats/profile/${id}`)}
          />
        </View>

        {/* Messages */}
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.messagesBackground}>
          <FlatList
            ref={flatListRef}
            data={currentMessages}
            keyExtractor={(_, index) => index.toString()}
            // 👈 makes chat start from bottom & grow upward
            onContentSizeChange={() =>
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
            } // 👈 auto-scroll to bottom when new messages arrive
            renderItem={({ item }) => {
              const isMe = item.username === myUsername;
              return (
                <View
                  style={[
                    styles.messageContainer,
                    isMe ? styles.myMessage : styles.friendMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isMe ? styles.myBubble : styles.friendBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{item.message}</Text>
                  </View>
                </View>
              );
            }}
          />
        </ImageBackground>

        {/* Typing Area */}
        <ChatTypingArea toUsername={id} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messagesBackground: {
    flex: 1,
  },
  messageText: {
    color: "#fff",
    fontSize: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(17,17,17)",
  },
  headerWrapper: {
    backgroundColor: "grey",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    alignSelf: "flex-start",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 15,
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  friendMessage: {
    justifyContent: "flex-start",
  },
  myBubble: {
    backgroundColor: "rgba(0, 119, 79, 1)",
    alignSelf: "flex-end",
  },
  friendBubble: {
    backgroundColor: "rgb(36, 38,38)",
    alignSelf: "flex-start",
  },
});
