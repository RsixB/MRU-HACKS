import { StyleSheet, Text, View, Image, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useAuthStore } from '@/src/store/auth-store'
import { useRouter } from 'expo-router'
import { useProfileStore } from '@/src/store/profile-store'
import DEFAULT_PROFILE from "../../assets/images/DEFAULT_PROFILE_PICTURE.jpg"
import { useChatStore } from '@/src/store/chat-store'
import { useActiveStore } from '@/src/store/active-store'
interface ProfileInformation {
  username: string,
  friends: number,
  profilePicture: string,
  createdChats: number
}

export default function Profile() {
  const {disconnectWebSocket} = useActiveStore()
  const { chatsCreated, friendCount, clearProfileStore } = useProfileStore()
  const router = useRouter()
  const {clearChatStore} = useChatStore()
  const { logout, username, profilePicture } = useAuthStore()
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const pickImage = async () => {
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri) 
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable 
          style={styles.headerButton} 
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="white" />
        </Pressable>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        <Pressable onPress={pickImage}>
          <Image 
            source={
              profilePicture ? {uri : profilePicture} :
              DEFAULT_PROFILE
            } 
            style={styles.avatar} 
          />
        </Pressable>
        <Text style={styles.username}>@{username}</Text>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{friendCount}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{chatsCreated}</Text>
            <Text style={styles.statLabel}>Created Chats</Text>
          </View>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <Pressable 
              style={styles.menuItem} 
              onPress={() => {
                logout()
                clearProfileStore()
                clearChatStore()
                disconnectWebSocket()
                router.replace('/(auth)/login')
              }}
            >
              <Text style={styles.menuText}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(10,10,10)",
  },
  header: {
    backgroundColor: "rgb(10,10,10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(22,23,23)",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  headerButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -11 }],
    padding: 6,
  },
  content: {
    alignItems: "center",
    marginTop: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 24,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingTop: 50,
    paddingRight: 16,
  },
  menu: {
    backgroundColor: "rgb(22,23,23)",
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 120,
  },
  menuItem: {
    backgroundColor:"rgba(83, 22, 22, 1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    color: "white",
    fontSize: 16,
  },
})
