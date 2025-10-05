import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerStyle: { backgroundColor: "#223755ff" }, 
          headerTintColor: "#fff", 
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Signup",
          headerStyle: { backgroundColor: "#223755ff"},
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
