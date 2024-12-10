import React from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';

export default function MainLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
} 