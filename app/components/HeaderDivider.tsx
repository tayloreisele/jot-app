import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function HeaderDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    position: 'absolute',
    top: 0,
    left: -16,  // Compensate for container padding
    right: -16, // Compensate for container padding
    width: '120%',  // Make it a bit wider to ensure full coverage
  },
});
