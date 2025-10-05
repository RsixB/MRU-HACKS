// src/components/SearchHeader.tsx
import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface SearchHeaderProps {
  searchActive: boolean
  onFocus?: () => void
  onBlur?: () => void
  onBack?: () => void,
  searchField: string
  setSearchField: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchHeader({ searchActive, onFocus, onBlur, onBack, searchField, setSearchField}: SearchHeaderProps) {
  return (
    <View style={styles.searchContainer}>
      {searchActive && (
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="white" />
        </Pressable>
      )}
      <TextInput 
        style={[styles.searchInput, searchActive && { flex: 1 }]}
        placeholder="Search for friends"
        placeholderTextColor="gray"
        onFocus={onFocus}
        onPress={onFocus}
        value={searchField}
        onChangeText={setSearchField}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgb(10,10,10)",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(22,23,23)",
  },
  searchInput: {
    backgroundColor: "rgb(22,23,23)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "white",
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
})
