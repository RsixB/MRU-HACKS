import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ProfileHeaderProps {
  onBack: () => void
}

export default function ProfileHeader({onBack}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable> 
      
      <Text style={styles.title}>
        Contact info
      </Text>    

      {/* Spacer so title stays centered even with only one button */}
      <View style={styles.rightSpacer} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(10,10,10)',
    backgroundColor: 'rgb(10,10,10)',
  },
  backButton: {
    padding: 6,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  rightSpacer: {
    width: 24 + 12, // same width as back button area (icon + padding)
  },
})
