import React from 'react';
import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="new-note"
        options={{
          headerTitle: 'New Note',
          headerLargeTitle: false,
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontSize: 17,
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </Stack>
  );
} 