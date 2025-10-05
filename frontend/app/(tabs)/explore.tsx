// app/Explore.tsx
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchHeader from '@/src/components/SearchHeader'
import UserRow from '@/src/components/UserRow'
import FriendRequestRow from '@/src/components/FriendRequestRow'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useProfileStore } from '@/src/store/profile-store'


export default function Explore() {

  const [searchField, setSearchField] = useState<string>("")
  const { friendRequests, searchUser } = useProfileStore()
  const [searchActive, setSearchActive] = useState(false)
  const [searchedUser, setSearchedUser] = useState({
    username: "",
    profilePicture: ""
  })

  useEffect(() => {
    if(!searchField)return
    (async() => {
      const data = await searchUser(searchField);
      if(data){
        setSearchedUser({
          username: data.username,
          profilePicture: data.profilePicture
        })
      } else {
        setSearchedUser({
          username: "",
          profilePicture: ""
        })
      }
    })()
  }, [searchField])

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader 
        searchActive={searchActive}
        onFocus={() => setSearchActive(true)} 
        onBlur={() => setSearchActive(false)} 
        onBack={() => setSearchActive(false)} 
        searchField={searchField}
        setSearchField={setSearchField}
      />

      {!searchActive ? (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          {friendRequests.map((req, index) => (
            <FriendRequestRow 
              key={index}
              username={req.username}
              profilePicture={req.profilePicture}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.searchResults}>
          {
            searchedUser.username &&
            <UserRow 
              username={searchedUser.username} 
              profilePicture={searchedUser.profilePicture}
            />
          }
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(10,10,10)",
  },
  content: {
    flex: 1,
  },
  searchResults: {
    flex: 1,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
})
