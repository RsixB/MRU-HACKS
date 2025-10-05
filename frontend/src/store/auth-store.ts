import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { serverAPI } from '../utils/axiosInstance'


interface AuthState {
  token: string
  isAuthenticated: boolean
  username: string,
  profilePicture: string
  verifyUsername: (username : string) => Promise<Boolean>
  signUp: (username: string, email: string, password: string) => void
  login: (email: string, password: string) => void
  logout: () => void,
  uploadProfilePicture: (pfp: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      profilePicture: '',
      token: '',
      isAuthenticated: false,
      username: "",

      verifyUsername: async (username) => {
        try {
          const res = await serverAPI.post("/verify-username", {
            username: username
          })
          const data = res.data
          if(data.err) throw new Error();
          return data.available
        } catch (e) {

        }
      },
      signUp: async(username, email, password) => {
        try {
          const res = await serverAPI.post("/auth/register", {
            username: username,
            email,
            password,
          })
          const data = res.data
          if(data.err || !data.created) throw new Error();
          set({
            username: username,
            token: data.token,
            isAuthenticated: true
          })
        } catch (e) {
          set({
            username: '',
            token: '',
            isAuthenticated: false
          })          
        }
      },
      login: async(email, password) => {
        try {
          const res = await serverAPI.post("/auth/login", {
            email,
            password,
          })
          const data = res.data
          if(data.err) throw new Error();
          set({
            username: data.username,
            token: data.token,
            isAuthenticated: true,
            profilePicture: data.profilePicture
          })
        } catch (e) {
          console.log('caught an error')
          set({
            username: '',
            token: '',
            isAuthenticated: false
          })          
        }
      },
      uploadProfilePicture: (pfp) => {
        try {
          serverAPI.post("/auth/profile-picture", {
            image: pfp,
            token: get().token
          })
        } catch (e) {

        }
      },      
      logout: () => {
        set({
          token: '',
          isAuthenticated: false,
          username: '',
          profilePicture: "",
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
)
