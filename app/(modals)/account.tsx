import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import HeaderDivider from '../components/HeaderDivider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('Current auth user:', auth.currentUser);
      
      // First try to get from current auth state
      if (auth.currentUser?.email) {
        console.log('Using current auth email:', auth.currentUser.email);
        setUserEmail(auth.currentUser.email);
        return;
      }

      // If not available, try to get from AsyncStorage
      try {
        const cachedUser = await AsyncStorage.getItem('auth_user');
        console.log('Cached user data:', cachedUser);
        if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          console.log('Parsed user data:', userData);
          if (userData.email) {
            console.log('Setting email from cache:', userData.email);
            setUserEmail(userData.email);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('auth_user');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderDivider isModal />
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userEmail}</Text>
      </View>

      <Pressable 
        style={styles.button} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 108,
  },
  section: {
    paddingVertical: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 