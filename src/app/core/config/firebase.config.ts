import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyB_a7l2ZJdWd9QkY7X8mR5nL3pO2qS4t6wI",
  authDomain: "visual-vault-123.firebaseapp.com",
  projectId: "visual-vault-123",
  storageBucket: "visual-vault-123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, storage, ref, uploadBytesResumable, getDownloadURL, deleteObject, analytics };