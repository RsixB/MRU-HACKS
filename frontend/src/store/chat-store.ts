import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { serverAPI } from '../utils/axiosInstance'
import { useAuthStore } from './auth-store'

interface ChatStore {
  sideBar: FriendListBar[],
  chatMessages: {[key: string]: ChatMessage[]}
  chatsNotifications: number
  chatNames:  {[key: string]: string}
  friends: Friend[],
  getFriends: () => void,
  addUserToBar: (username: string, profilePicture: string) => void,
  updateChatName: (username: string, name: string) => void,
  getChatSideBar: () => void,
  getChatMessages: () => void,
  clearChatStore: () => void,
  receiveMessages: (fromUsername: string) => void
  sendMessage: (toUsername: string, message: string ) => Promise<boolean>,
  addChatNotification: (username: string) => void,
  updateLastMessage: (username: string, message: string) => void
  removeChatNotification: (username: string) => void
}

interface FriendListBar {
  profilePicture: string;
  username: string;
  lastMessage: string;
  timeSent: Date | null | string;
  name: string;
  notifications: number;
}

interface ChatMessage {
  username: string,
  message: string,
  createdAt: Date | null
}

interface Friend {
  username: string,
  profilePicture: string
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      friends: [],
      chatNames: {},
      chatsNotifications: 0,
      chatMessages: {},
      sideBar: [],
      getFriends: async() => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/get-friends", {
            token: token,
          })
          const data = res.data
          if(data.err) throw new Error();
          set({
            friends: data.friends
          })
        } catch (e) {
          console.log("error getting bar")
        }            
      },
      updateChatName: (username, name) => {
        let temp = get().chatNames
        temp[username] = name
        set({
          chatNames: temp
        })
      },
      addUserToBar: (username, profilePicture) => {
        set({
          sideBar: [
            {
              username: username, 
              profilePicture: profilePicture,
              timeSent: null,
              lastMessage: '',
              name: username,
              notifications: 0
            }, ...get().sideBar]
        })
      },
      updateLastMessage: (username, message) => {
        const target = get().sideBar.find((user) => user.username === username)
        if(!target) return
        const removed = get().sideBar.filter((user) => user.username !== username)
        set({
          sideBar: [
            ...removed,
            {
              username: target.username,
              profilePicture: target.profilePicture,
              name: target.name,
              notifications: target.notifications,
              lastMessage: message,
              timeSent: new Date()
            }
          ]
        })
      },
      addChatNotification: (username) => {
        const target = get().sideBar.find((user) => user.username === username)
        if(!target) return
        const removed = get().sideBar.filter((user) => user.username !== username)
        set({
          sideBar: [
            ...removed,
            {
              username: target.username,
              profilePicture: target.profilePicture,
              name: target.name,
              notifications: target.notifications+1,
              lastMessage: target.lastMessage,
              timeSent: target.timeSent
            }
          ],
          chatsNotifications: get().chatsNotifications + 1
        })
      }, 
      removeChatNotification: (username) => {
        const target = get().sideBar.find((user) => user.username === username)
        if(!target) return
        const removed = get().sideBar.filter((user) => user.username !== username)
        set({
          sideBar: [
            ...removed,
            {
              username: target.username,
              profilePicture: target.profilePicture,
              name: target.name,
              notifications: 0,
              lastMessage: target.lastMessage,
              timeSent: target.timeSent
            }
          ],
          chatsNotifications: (get().chatsNotifications - target.notifications)
        })
      },
      getChatSideBar: async() => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/friend-list-bar", {
            token: token,
          })
          const data = res.data
          if(data.err) throw new Error();
          set({
            sideBar: data.display
          })
          for(let i = 0; i < data.display.length; i++){
            let temp = get().chatNames
            if(typeof temp[data.display[i].username] !== "string"){
              temp[`${data.display[i].username}`] = data.display[i].username
              set({
                chatNames: temp
              })
            }
          }
        } catch (e) {
          console.log("error getting bar")
        }        
      },
      getChatMessages: async() => {
        try {
          await get().getChatSideBar();
          
          if(!get().sideBar.length) return;
          
          const { token } = useAuthStore.getState()
          let temp: {[key: string]: ChatMessage[]} = {}
          for(let i = 0; i < get().sideBar.length; i++) {
            const username = get().sideBar[i].username
            const res = await serverAPI.post("/messages", {
              token: token,
              username
            })
            const data = res.data
            
            if(data.err) throw new Error();
            temp[username] = data.messages
          }
          set({
            chatMessages: temp
          });
        } catch (e) {
          console.log("error getting bar")
        }    
      },
      sendMessage: async (toUsername, message) => {
        try {
          const { token,username } = useAuthStore.getState()
          const res = await serverAPI.post("/send-message", {
            token: token,
            content: {
              toUsername,
              message
            }
          })
          const data = res.data
          
          if(data.err || !data.sent) throw new Error(); 
          let temp = get().chatMessages
          temp[`${toUsername}`] = [...get().chatMessages[toUsername], {
            username: username,
            message: message,
            createdAt: null
          }] 
          set({
            chatMessages: temp
          })
          get().updateLastMessage(toUsername, message);       
          return true
        
        } catch (e) {
          return false
        }  
      },
      receiveMessages: async (fromUsername) => {
        try {
          const { token } = useAuthStore.getState()
          const res = await serverAPI.post("/messages", {
            token: token,
            username: fromUsername
          })
          const data = res.data
          if(data.err) throw new Error();
          get().addChatNotification(fromUsername);
          get().updateLastMessage(fromUsername, data.messages[data.messages.length - 1].message)
          let temp = get().chatMessages
          temp[`${fromUsername}`] = data.messages 
          set({
            chatMessages: temp
          })
          
        } catch (e) {
          console.error("error receiving message")
        }  
      },      
      clearChatStore: () => {
        set({
          sideBar: [],
          chatMessages: {},
          chatsNotifications: 0,
          chatNames: {},
          friends: []
        })
      }
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
)
