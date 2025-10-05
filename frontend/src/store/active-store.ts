import { create } from "zustand";
import { io } from "socket.io-client"
import { BACKEND_URL } from '../utils/axiosInstance'
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useAuthStore } from "./auth-store";
import { useProfileStore } from "./profile-store";
import { useChatStore } from "./chat-store";

interface ActiveStore {
  inChat: boolean,
  webSocket: null | Socket<DefaultEventsMap, DefaultEventsMap>,
  setInChat: (inChat: boolean) => void
  connectWebSocket: () => void,
  disconnectWebSocket: () => void
}

export const useActiveStore = create<ActiveStore>((set,get) => {
  return {
    inChat: false,
    webSocket: null,
    setInChat: (inChat) => {
      set({
        inChat
      })
    },
    connectWebSocket: async() => {
      try{
        const { isAuthenticated, username } = useAuthStore.getState();
        const { receiveMessages } = useChatStore.getState()
        const { getFriendRequests } = useProfileStore.getState();
        if(!isAuthenticated || get().webSocket?.connected) return;

        const socket = io(BACKEND_URL, {
          query: {
            username
          }
        })
        socket.connect();

        socket.on("friend-request", (data) => {
          getFriendRequests()
        }) 

        socket.on("new-message", (data) => {
          receiveMessages(data.from)
        })

        set({
          webSocket: socket
        })

      } catch(e){
        console.log('error with socket connection')
      }
    }, 
    disconnectWebSocket: () => {
      if(!get().webSocket?.connected) {
        return 
      } else {
        get().webSocket?.disconnect()
        set({
          webSocket: null
        })
      }
    }    
  }
})