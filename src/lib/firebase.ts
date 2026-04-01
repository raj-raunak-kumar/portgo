

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwm9niVdIzaAGn85JlHw85_YbNoAeJpjA",
  authDomain: "portfolio-23f9c.firebaseapp.com",
  projectId: "portfolio-23f9c",
  storageBucket: "portfolio-23f9c.firebasestorage.app",
  messagingSenderId: "938450685777",
  appId: "1:938450685777:web:1ceb99ede9ea35d745cd70",
  measurementId: "G-5W037DW5Q9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Analytics conditionally (only runs on client)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, storage, analytics };


