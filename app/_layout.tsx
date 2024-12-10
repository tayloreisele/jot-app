import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';

export default function RootLayout() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!initialRoute) {
        setInitialRoute(user ? '/main' : '/(auth)/login');
        if (!user) {
          router.replace('/(auth)/login');
        }
      }
    });

    return unsubscribe;
  }, []);

  if (!initialRoute) return null;

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
            <Pressable onPress={() => router.push('/(modals)/account')}>
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
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="main"
        options={{
          headerTitle: 'Notes',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 36,
            fontWeight: '600',
          },
          headerBackVisible: false,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
      <Stack.Screen
        name="(modals)/account"
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
        name="(screens)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}