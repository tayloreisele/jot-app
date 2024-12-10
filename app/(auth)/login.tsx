import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useState, useEffect } from 'react';
import { isValidEmail, getFirebaseErrorMessage } from '../utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remember me preference and previous email if it exists
  useEffect(() => {
    loadRememberMe();
  }, []);

  const loadRememberMe = async () => {
    try {
      const [rememberValue, savedEmail] = await Promise.all([
        AsyncStorage.getItem('rememberMe'),
        AsyncStorage.getItem('savedEmail')
      ]);
      
      if (rememberValue !== null) {
        setRememberMe(rememberValue === 'true');
        if (rememberValue === 'true' && savedEmail) {
          setEmail(savedEmail);
        }
      }
    } catch (error) {
      console.error('Error loading remember me preference:', error);
    }
  };

  const saveRememberMe = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('rememberMe', value.toString());
      setRememberMe(value);
      
      // If remember me is turned off, clear the saved email
      if (!value) {
        await AsyncStorage.removeItem('savedEmail');
      }
    } catch (error) {
      console.error('Error saving remember me preference:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Email validation
    if (!email) {
      newErrors.push('Email is required');
    } else if (!isValidEmail(email)) {
      newErrors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password) {
      newErrors.push('Password is required');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Save email if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
      }
      router.replace('/main');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = getFirebaseErrorMessage(err.code);
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        
        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={styles.error}>{error}</Text>
            ))}
          </View>
        )}

        <TextInput
          style={[styles.input, errors.some(e => e.includes('email')) && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors([]);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
          returnKeyType="next"
        />

        <TextInput
          style={[styles.input, errors.some(e => e.includes('password')) && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors([]);
          }}
          secureTextEntry
          editable={!isLoading}
          returnKeyType="go"
          onSubmitEditing={handleLogin}
          textContentType="password"
          autoComplete="current-password"
          autoCorrect={false}
        />

        <View style={styles.rememberMeContainer}>
          <Pressable 
            style={styles.rememberMeButton} 
            onPress={() => saveRememberMe(!rememberMe)}
            disabled={isLoading}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </Pressable>
          <Pressable 
            style={styles.forgotPasswordButton}
            onPress={() => router.push('/reset-password')}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>

        <Pressable 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </Pressable>

        <Pressable 
          style={styles.linkButton} 
          onPress={() => router.push('/signup')}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
    fontWeight: '600',
  },
  errorContainer: {
    width: '100%',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  error: {
    color: '#D00',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#D00',
    backgroundColor: '#FFF5F5',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#99C9FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  rememberMeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  rememberMeText: {
    color: '#666',
    fontSize: 14,
  },
  forgotPasswordButton: {
    padding: 4,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
}); 