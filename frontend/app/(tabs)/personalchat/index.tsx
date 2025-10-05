import React, { useState } from "react";
import {View,Text,FlatList,StyleSheet,Image,Pressable,TouchableOpacity,Modal,TextInput,Button,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DEFAULT_PROFILE from "../../../assets/images/DEFAULT_PROFILE_PICTURE.jpg"
import { useRouter } from "expo-router";
import { useProfileStore } from "@/src/store/profile-store";
interface CreateChatBar {
  name: string;
  profilePicture: string;
}

export default function CreateChatPage() {
  const { setChatsCreated, chatsCreated} = useProfileStore()
  const [chats, setChats] = useState<CreateChatBar[]>([]);
  const router = useRouter()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const handleAddChat = () => setIsModalVisible(true);
  const handleCancel = () => {
    setNewChatName("");
    setIsModalVisible(false);
  };

  const handleCreateChat = () => {
    if (newChatName.trim() === "") return;
    setChats((prev) => [
      ...prev,
      { name: newChatName.trim(), profilePicture: "" },
    ]);
    setNewChatName("");
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
          <TouchableOpacity onPress={handleAddChat} style={styles.addButton} onPressIn={() => {
            setChatsCreated(chatsCreated + 1)
          }}>
            <Ionicons name="add-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Chat list */}
        <FlatList
          data={chats}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable 
            style={styles.chatItem}
            onPress={()=>{router.push(`/personalchat/${item.name}`)}}
            >
              <Image
                source={
                  item.profilePicture
                    ? { uri: item.profilePicture }
                    : DEFAULT_PROFILE
                }
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No chats available</Text>
          }
        />

        {/* Modal for creating a new chat */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create New Chat</Text>
              <Image source={DEFAULT_PROFILE} style={styles.modalAvatar} />
              <TextInput
                placeholder="Enter chat name"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={newChatName}
                onChangeText={setNewChatName}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={handleCancel} color="gray" />
                <Button title="Create" onPress={handleCreateChat} />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(17,17,17)",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "700" },
  addButton: { padding: 4 },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  chatInfo: { flex: 1 },
  chatName: { color: "white", fontSize: 16, fontWeight: "600" },
  emptyText: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "rgb(24,24,24)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
