import React from 'react';
import { View, StyleSheet } from 'react-native';

// Fallback for platforms where the tab bar is opaque
export default function TabBarBackground() {
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff', // Default background color
  },
});

export function useBottomTabOverflow() {
  return 0;
}
