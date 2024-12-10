import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function HeaderDivider({ isModal }: { isModal?: boolean }) {
  return <View style={[styles.divider, isModal && styles.modalDivider]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    position: 'absolute',
    top: 0,
    left: -16,
    right: -16,
    width: '120%',
  },
  modalDivider: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,  // Add some space below the divider
    left: 0,
    right: 0,
  },
});