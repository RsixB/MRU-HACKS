import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useChatStore } from "../store/chat-store";
type ChatTypingAreaProps = {
  toUsername: string
};

export function ChatTypingArea({ toUsername }: ChatTypingAreaProps) {
  const [text, setText] = useState(""); 
  const {sendMessage} = useChatStore()
  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(toUsername, text.trim())
    setText("");
  };

  return (
    <View style={styles.container}>
      {/* Plus Icon */}
      <Pressable style={styles.iconButton}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      {/* Input */}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        placeholderTextColor="#888"
        style={styles.input}
        multiline
      />

      {/* Send Button (only visible if text is typed) */}
      {text.trim().length > 0 && (
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgb(15,15,15)",
    backgroundColor: "rgb(15,15,15)",
  },
  iconButton: {
    padding: 6,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgb(40,40,40)",
    fontSize: 16,
    color: "white",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "rgb(92, 189, 109)",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
