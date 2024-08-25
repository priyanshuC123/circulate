// firebase/setup.ts

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFxJ0qNMvnM-oSmEoaal5V3FJOSJxS9GU",
    authDomain: "circulate-30252.firebaseapp.com",
    projectId: "circulate-30252",
    storageBucket: "circulate-30252.appspot.com",
    messagingSenderId: "199997582779",
    appId: "1:199997582779:web:c1adf2fb16975cb49d689e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in the app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Firestore, for database operations
export const storage = getStorage(app); // Storage, for file uploads
