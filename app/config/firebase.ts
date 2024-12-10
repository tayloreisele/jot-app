import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "jot-app-ed946.firebaseapp.com",
  projectId: "jot-app-ed946",
  storageBucket: "jot-app-ed946.firebasestorage.app",
  messagingSenderId: "62582305019",
  appId: "1:62582305019:web:1d47004c8f821d6316405e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app; 