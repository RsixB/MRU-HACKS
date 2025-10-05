import { create } from "zustand";
import { serverAPI } from "../utils/axiosInstance";
import { useAuthStore } from "./auth-store";
interface TempStore {
  data: {
    friendshipNotes: string,
    friendshipScore: number
  } | null,
  getData: (username: string) => void,
  clearData: () => void
}

export const useTempStore = create<TempStore>((set) => {
  return {
    data: null,
    getData: async (username) => {
      try {
        const { token } = useAuthStore.getState()
        const res = await serverAPI.post("/ai/get-results", {
          token: token,
          username: username
        })
        const data = res.data
        if(data.err) throw new Error();
        set({
          data: data.gptResponse
        })
      } catch (e) {
        console.log("error getting ai results")
      }      
    }, 
    clearData: () => {
      set({
        data: null
      })
    }
  }
})