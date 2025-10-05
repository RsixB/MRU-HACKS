// src/components/UserRow.tsx
import { StyleSheet, View, Text, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import DEFAULT_PROFILE from "../../assets/images/DEFAULT_PROFILE_PICTURE.jpg"
import { useProfileStore } from '../store/profile-store'
import { useChatStore } from '../store/chat-store'

interface UserRowProps {
  username: string
  profilePicture: string
}

export default function UserRow({ username, profilePicture }: UserRowProps) {
  const { addUserToBar } = useChatStore()
  const {sendFriendRequest, setFriendCount, friendCount} = useProfileStore()
  const [added, setAdded] = useState(false)

  return (
    <View style={styles.container}>
      <Image 
        source={
          profilePicture ? {uri : profilePicture} :
          DEFAULT_PROFILE
        }        
       style={styles.avatar} />
      <Text style={styles.username}>{username}</Text>

      <Pressable 
        onPress={() => {
          addUserToBar(username, profilePicture)
          setAdded(!added);
          sendFriendRequest(username)
          setFriendCount(friendCount+1)
        }} 
        style={[styles.addButton, added && styles.addedButton]}
      >
        <Text style={[styles.addButtonText, added && styles.addedButtonText]}>
          {added ? "Added" : "Add"}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    flex: 1,
  },
  addButton: {
    backgroundColor: "rgb(30,144,255)", // blue
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  addedButton: {
    backgroundColor: "rgb(22,23,23)", // dark gray when added
    borderWidth: 1,
    borderColor: "gray",
  },
  addedButtonText: {
    color: "gray",
  },
})
