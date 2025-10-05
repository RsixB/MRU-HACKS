import { create } from "zustand";

interface TempStore {
  isAuth: boolean,
  setAuth: (isAuth: boolean) => void
}

export const useTempStore = create<TempStore>((set) => {
  return {
    isAuth: false,
    setAuth: (isAuth) => {
      set({
        isAuth
      })
    }
  }
})