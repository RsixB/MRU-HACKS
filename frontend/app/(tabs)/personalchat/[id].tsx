// app/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Store selected image URIs
  const [images, setImages] = useState<string[]>([]);

  // Safely extract chat name
  const chatName =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "Chat";

  // Open image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chatName}
          </Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-attach-outline" size={18} color="white" />
          <Text style={styles.actionText}>Upload File</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={18} color="white" />
          <Text style={styles.actionText}>Add Image</Text>
        </TouchableOpacity>
      </View>

      {/* CHAT AREA */}
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {images.length === 0 ? (
          <Text style={styles.placeholderText}>No images yet. Add one above.</Text>
        ) : (
          images.map((uri, index) => (
            <View key={index} style={styles.imageBubble}>
              <Image source={{ uri }} style={styles.chatImage} />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(17,17,17)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  chatContainer: {
    padding: 16,
  },
  placeholderText: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 20,
  },
  imageBubble: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 6,
    marginVertical: 6,
    maxWidth: "80%",
  },
  chatImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
