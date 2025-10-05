import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useEffect } from "react";
import { useProfileStore } from "@/src/store/profile-store";

import { useChatStore } from "@/src/store/chat-store";

export default function TabsLayout() {
  const { getFriendRequests, searchNotifications } = useProfileStore()
  const { getChatMessages, chatsNotifications,chatMessages } = useChatStore()
  

  useEffect(() => {
    getFriendRequests()
  }, [])

  useEffect(() => {
    getChatMessages
  },[])
  return (
    <Tabs
    screenOptions={{
      tabBarStyle: {
        backgroundColor: "rgb(16,16,16)"
      }
    }}
      >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarBadge: searchNotifications ? searchNotifications : undefined,
          headerShown: false,
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          headerTintColor: "white",
          headerShown: true,
          tabBarStyle: {
            display: "flex",
            backgroundColor: "rgb(16,16,16)"
          },
          headerStyle: {
            backgroundColor: "rgb(16,16,16)",
            
          },
          tabBarBadge: chatsNotifications ? chatsNotifications : undefined,
          tabBarLabel: "Chats",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="comment" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
