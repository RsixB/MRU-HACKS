// personalchat/_layout.tsx
import { Stack } from "expo-router";

export default function PersonalChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // use your custom header in [id].tsx
      }}
    />
  );
}
