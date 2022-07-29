// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwurIjOc88XPCZueJriD56R_bzEQqmsSk",
  authDomain: "ps-temple-4d20b.firebaseapp.com",
  projectId: "ps-temple-4d20b",
  storageBucket: "ps-temple-4d20b.appspot.com",
  messagingSenderId: "798697519435",
  appId: "1:798697519435:web:1b999c340fe0d9696d90ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// exports
export const auth = getAuth(app);
export const storage = getStorage(app)
export const db = getFirestore();