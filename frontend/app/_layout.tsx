import { Stack } from "expo-router";
import { useEffect } from "react";
export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" /> 
    </Stack>
  );
}
