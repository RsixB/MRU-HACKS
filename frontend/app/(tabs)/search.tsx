import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const mockUsers = [
  { id: "1", name: "Alice Johnson", username: "@alice", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "2", name: "Bob Smith", username: "@bob", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "3", name: "Clara Evans", username: "@clara", avatar: "https://i.pravatar.cc/150?img=10" },
  { id: "4", name: "David Miller", username: "@david", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: "5", name: "Ella Brown", username: "@ella", avatar: "https://i.pravatar.cc/150?img=7" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#6c757d" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Search people or chats..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#adb5bd"
        />
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => router.push(`/chat/${item.id}`)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.username}>{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query ? (
            <Text style={styles.noResults}>No results found</Text>
          ) : (
            <Text style={styles.noResultsMuted}>Start typing to search...</Text>
          )
        }
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#212529",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  username: {
    fontSize: 14,
    color: "#6c757d",
  },
  noResults: {
    textAlign: "center",
    color: "#6c757d",
    marginTop: 40,
    fontSize: 16,
  },
  noResultsMuted: {
    textAlign: "center",
    color: "#adb5bd",
    marginTop: 40,
    fontSize: 16,
  },
});
