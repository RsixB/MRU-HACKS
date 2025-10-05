// app/auth/index.tsx
import { Redirect } from "expo-router";

import { useAuthStore } from "@/src/store/auth-store";

export default function AuthIndex() {
  const { isAuthenticated } = useAuthStore()
  if(isAuthenticated){
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
