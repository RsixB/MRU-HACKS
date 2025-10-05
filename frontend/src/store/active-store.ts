import { create } from "zustand";

interface ActiveStore {
  inChat: boolean,
  setInChat: (inChat: boolean) => void
}

export const useActiveStore = create<ActiveStore>((set) => {
  return {
    inChat: false,
    
    setInChat: (inChat) => {
      set({
        inChat
      })
    }
  }
})