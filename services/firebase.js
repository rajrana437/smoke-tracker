import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBq9Xj1xNSN5lCmJlgyn97NKckp5pVOBFU",
  authDomain: "smoke-tracker-893b1.firebaseapp.com",
  projectId: "smoke-tracker-893b1",
  storageBucket: "smoke-tracker-893b1.appspot.com",
  messagingSenderId: "649281852991",
  appId: "1:649281852991:web:6f3e1b3f979f9f1bd30a8a",
  measurementId: "G-EBCP8MSXWM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Use AsyncStorage for persistence
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };