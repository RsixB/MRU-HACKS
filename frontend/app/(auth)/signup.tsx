import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth-store";


export default function SignupScreen() {
  const { signUp, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [usernameField, setUsernameField] = useState<string>("")
  const [emailField, setEmailField] = useState<string>("")
  const [passwordField, setPasswordField] = useState<string>("")
  const [confirmField, setConfirmField] = useState<string>("")
  
  useEffect(() => {
    if(!isAuthenticated) return
    // connectWebSocket()
    router.replace('/(tabs)')
  }, [isAuthenticated])

  const submitForm = async() => {
    if(!emailField || !passwordField || !usernameField) return
    if(passwordField !== confirmField) return
    signUp(usernameField, emailField, passwordField)
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            autoCapitalize="words"
            value={usernameField}
            onChangeText={setUsernameField}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailField}
            onChangeText={setEmailField}            
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={passwordField}
            onChangeText={setPasswordField}            
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmField}
            onChangeText={setConfirmField}            
          />

          <TouchableOpacity style={styles.button} onPress={submitForm}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "rgb(12,19,29)", // dark background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff", // white title
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa", // light gray subtitle
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#444", // dark gray border
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#111", 
    color: "#fff",
  },
  button: {
    backgroundColor: "#007bff", 
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
