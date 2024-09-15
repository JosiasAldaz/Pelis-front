// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5iiNFnxXxAZCyhw2brqAUs_uspwSFijw",
  authDomain: "peliculas-87b7d.firebaseapp.com",
  projectId: "peliculas-87b7d",
  storageBucket: "peliculas-87b7d.appspot.com",
  messagingSenderId: "386552947334",
  appId: "1:386552947334:web:7adc148ce280554a0ba707"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth();
export const db = getFirestore(app); // Initialize Firestore

export default app;
