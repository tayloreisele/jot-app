import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom type for cached user data
type CachedUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<CachedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Separate function to handle user state updates
  const updateUserState = async (userData: CachedUser | null) => {
    console.log('Updating user state:', userData);
    setUser(userData);
    if (userData) {
      await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      await AsyncStorage.removeItem('auth_user');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Try to get cached user first
        const cachedUserStr = await AsyncStorage.getItem('auth_user');
        console.log('Cached user string:', cachedUserStr);
        
        if (cachedUserStr && isMounted) {
          const cachedUser = JSON.parse(cachedUserStr);
          console.log('Parsed cached user:', cachedUser);
          updateUserState(cachedUser);
        }

        // Then check Firebase current user
        const currentUser = auth.currentUser;
        console.log('Current Firebase user:', currentUser?.email);
        
        if (currentUser && isMounted) {
          const userData: CachedUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
          };
          updateUserState(userData);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed. New user:', firebaseUser?.email);
      
      if (firebaseUser && isMounted) {
        const userData: CachedUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        };
        updateUserState(userData);
      } else if (isMounted) {
        updateUserState(null);
      }
    });

    // Initialize auth state
    initializeAuth();

    // Cleanup
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/main');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    // You might want to show a loading screen here
    return null;
  }

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
        contentStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Pressable onPress={() => router.push('/(modals)/search')}>
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
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#f8f8f8',
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
          headerShadowVisible: false,
          headerRight: CloseButton,
        }}
      />
      <Stack.Screen
        name="(modals)/search"
        options={{
          presentation: 'modal',
          headerTitle: 'Search',
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: '600',
          },
          headerShadowVisible: false,
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