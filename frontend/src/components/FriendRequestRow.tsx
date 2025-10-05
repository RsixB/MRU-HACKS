// src/components/FriendRequestRow.tsx
import { StyleSheet, View, Text, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useProfileStore } from '../store/profile-store'
import DEFAULT_PROFILE from "../../assets/images/DEFAULT_PROFILE_PICTURE.jpg"
import { useChatStore } from '../store/chat-store'

interface FriendRequestRowProps {
  username: string
  profilePicture: string
}

export default function FriendRequestRow({ username, profilePicture }: FriendRequestRowProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">("pending")
  const {addUserToBar} = useChatStore()
  const {acceptFriendRequest, rejectFriendRequest, friendCount, setFriendCount} = useProfileStore()
  return (
    <View style={styles.container}>
      <Image 
        source={
          profilePicture ? {uri : profilePicture} :
          DEFAULT_PROFILE
        }       
       style={styles.avatar} />
      <Text style={styles.username}>{username}</Text>

      {status === "pending" && (
        <View style={styles.buttons}>
          <Pressable style={[styles.button, styles.accept]} onPress={() => {
            setStatus("accepted");
            addUserToBar(username, profilePicture)
            acceptFriendRequest(username)
            setFriendCount(friendCount+1)
            }}>
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.reject]} onPress={() => {
            setStatus("rejected");
            rejectFriendRequest(username)
            }}>
            <Text style={styles.buttonText}>Reject</Text>
          </Pressable>
        </View>
      )}

      {status === "accepted" && <Text style={styles.acceptedText}>Accepted</Text>}
      {status === "rejected" && <Text style={styles.rejectedText}>Rejected</Text>}
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
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  accept: {
    backgroundColor: "rgb(34,197,94)", // green
  },
  reject: {
    backgroundColor: "rgb(239,68,68)", // red
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  acceptedText: {
    color: "rgb(34,197,94)",
    fontWeight: "600",
  },
  rejectedText: {
    color: "rgb(239,68,68)",
    fontWeight: "600",
  },
})