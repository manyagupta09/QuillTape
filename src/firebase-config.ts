// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzUMlV5AQiK1ZydbtIyCQ8fFBWdos29xU",
  authDomain: "docs-clone-19d7a.firebaseapp.com",
  projectId: "docs-clone-19d7a",
  storageBucket: "docs-clone-19d7a.firebasestorage.app",
  messagingSenderId: "775688271645",
  appId: "1:775688271645:web:a0423443fb2bf4c1db93f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);