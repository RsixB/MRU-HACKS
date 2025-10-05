import { StyleSheet, Text, View, Image, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileHeader from '@/src/components/ProfileHeader'
import { useChatStore } from '@/src/store/chat-store'
import DEFAULT_PROFILE from "../../../assets/images/DEFAULT_PROFILE_PICTURE.jpg"
import { useTempStore } from '@/src/store/temp-store'

interface ProfileContactInformation {
  username: string,
  name: string,
  profilePicture: string,
  friendshipScore: number,
  friendshipNotes: string
}



export default function FriendProfile() {

  const { getData, data } = useTempStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [friendshipNotes, setFriendshipNotes] = useState<string>()
  const [friendshipScore, setFriendshipScore ] = useState<number>()
  const {friends, chatNames, updateChatName} = useChatStore()
  const { rest } = useLocalSearchParams()
  const friendUsername: string = rest[1]

  const router = useRouter()
  const goBack = () => {
    router.back()
  }

  useEffect(() => {
    getData(friendUsername)
  }, [])

  useEffect(() => {
    if(!data) return
    setIsLoading(false)
    setFriendshipNotes(data.friendshipNotes)
    setFriendshipScore(data.friendshipScore)
    return () => {
      setIsLoading(true)
    }
  }, [data])

  const [name, setName] = useState(chatNames[friendUsername])
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if(name.length === 0) return
    updateChatName(friendUsername, name)
  }, [name])

  const currentFriend = friends.find((a) => a.username === friendUsername)
  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileHeader onBack={goBack} />

      <View style={styles.content}>
        <Image 
          source={
            currentFriend?.profilePicture ? {uri : currentFriend.profilePicture} :
            DEFAULT_PROFILE
          } 
          style={styles.profileImage}
        />

        {editing ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            onBlur={() => setEditing(false)}
            autoFocus
          />
        ) : (
          <Pressable onPress={() => setEditing(true)}>
            <Text style={styles.name}>{name}</Text>
          </Pressable>
        )}

        <Text style={styles.username}>@{friendUsername}</Text>
        {
          isLoading ? 
          <ActivityIndicator size="large" color="#ffffff" /> :
        <>
          <View style={styles.infoBox}>
            <Text style={styles.score}>
              Friendship score: {friendshipScore}/5
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.notes}>
              <Text style={styles.notesLabel}>Notes: </Text>
              {friendshipNotes}
            </Text>
          </View>
        </> 
        }
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(10,10,10)", 
  },
  content: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 4,
    paddingVertical: 2,
    minWidth: 160,
    textAlign: "center",
  },
  username: {
    fontSize: 14,
    color: "gray",
    marginBottom: 50, // space before friendship score
  },
  infoBox: {
    backgroundColor: "rgb(22,23,23)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "stretch",
    marginBottom: 12,
  },
  score: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  notes: {
    fontSize: 20,
    color: "lightgray",
  },
  notesLabel: {
    fontWeight: "600",
    color: "white",
  },
})
