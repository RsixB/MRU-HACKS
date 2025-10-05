import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { serverAPI } from '../utils/axiosInstance'
import { useAuthStore } from './auth-store'
import { useChatStore } from './chat-store'

interface FriendList {
  profilePicture: string,
  username: string
}

interface ProfileStore {
  friendCount: number,
  chatsCreated: number,
  friendRequests: FriendList[],
  searchNotifications: number
  getFriendRequests: () => void,
  setFriendCount: (count: number) => void,
  setChatsCreated: (count: number) => void,
  sendFriendRequest: (username: string) => Promise<boolean>
  clearProfileStore: () => void,
  acceptFriendRequest: (username: string) => void,
  rejectFriendRequest: (username: string) => void,
  searchUser: (username: string) => Promise<null | FriendList>
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      searchNotifications: 0,
      friendCount: 0,
      chatsCreated: 0,
      friendRequests: [],
      acceptFriendRequest: async (username) => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/accept-request", {
            token: token,
            username
          })
          const data = res.data
          if(data.err) throw new Error();
          set({
            friendRequests: data.friendRequests,
            searchNotifications: get().searchNotifications - 1
          })
        } catch (e) {

        }
      },
      rejectFriendRequest: async(username) => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/reject-request", {
            token: token,
            username
          })
          const data = res.data
          if(data.err) throw new Error();
          set({
            friendRequests: data.friendRequests,
            searchNotifications: get().searchNotifications - 1
          })
        } catch (e) {

        }
      },
      getFriendRequests: async() => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/get-friend-requests", {
            token: token
          })
          const data = res.data
          if(data.err) throw new Error();
          set({
            friendRequests: data.friendRequests,
            searchNotifications: data.friendRequests.length
          })
        } catch (e) {

        }
      },
      setFriendCount: (count) => {
        set({
          friendCount: count
        })
      },
      setChatsCreated: (count) => {
        set({
          chatsCreated: count,
        })
      },
      clearProfileStore: () => {
        set({
          friendCount: 0,
          chatsCreated: 0,
          friendRequests: [],
          searchNotifications: 0,
        })
      },
      sendFriendRequest: async(username) => {
        try {
          const { } = useChatStore.getState()
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/add", {
            token: token,
            username: username
          })
          const data = res.data
          if(data.err) throw new Error();

          return true
        } catch (e) {
          return false
        }   
      },
      searchUser: async(username) => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/search", {
            token: token,
            username: username
          })
          const data = res.data
          if(data.err) throw new Error();
          return {
            username: data.username,
            profilePicture: data.profilePicture
          }
        } catch (e) {
          return null
        }        
      }
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
)
