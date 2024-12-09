import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  const CloseButton = () => (
    <Pressable 
      onPress={() => router.back()} 
      style={{ 
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -8,
        marginRight: -12,
      }}
    >
      <Ionicons name="close" size={28} color="#000" />
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerLargeTitle: true,
        headerLargeStyle: {
          backgroundColor: '#fff',
        },
        headerLargeTitleStyle: {
          fontSize: 36,
          fontWeight: '600',
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Pressable onPress={() => router.push('/search')}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </Pressable>
            <Pressable onPress={() => router.push('/account')}>
              <Ionicons name="person-circle-outline" size={24} color="#000" />
            </Pressable>
          </View>
        ),
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="main/index"
        options={{
          title: 'Notes',
          headerLargeTitle: true,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          presentation: 'modal',
          headerTitle: 'Search',
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: '600',
          },
          headerRight: CloseButton,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          presentation: 'modal',
          headerTitle: 'Account',
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: '600',
          },
          headerRight: CloseButton,
        }}
      />
      <Stack.Screen
        name="(screens)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}