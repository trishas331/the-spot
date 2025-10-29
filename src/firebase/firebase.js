// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzJZ7LQroPuxV_t-y5XRHKoEC1tyRjFDA",
  authDomain: "the-spot-4f1db.firebaseapp.com",
  projectId: "the-spot-4f1db",
  storageBucket: "the-spot-4f1db.firebasestorage.app",
  messagingSenderId: "652305049367",
  appId: "1:652305049367:web:7bf54f86d716ccfd7e7952"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };