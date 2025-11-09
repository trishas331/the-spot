import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzJZ7LQroPuxV_t-y5XRHKoEC1tyRjFDA",
  authDomain: "the-spot-4f1db.firebaseapp.com",
  projectId: "the-spot-4f1db",
  storageBucket: "the-spot-4f1db.firebasestorage.app",
  messagingSenderId: "652305049367",
  appId: "1:652305049367:web:7bf54f86d716ccfd7e7952"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };