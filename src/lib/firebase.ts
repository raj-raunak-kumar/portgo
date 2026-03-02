

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5gZQadMZmTgW6TsSMDxwyfTf4SjQE1Co",
  authDomain: "portfolio-64e4a.firebaseapp.com",
  projectId: "portfolio-64e4a",
  storageBucket: "portfolio-64e4a.firebasestorage.app",
  messagingSenderId: "612753397181",
  appId: "1:612753397181:web:8e8a34744f0a6f981a2ed4",
  measurementId: "G-PYQM5BK0NR"
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


