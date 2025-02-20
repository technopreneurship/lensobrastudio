// Import the Firebase SDK
import firebase from "firebase/app"
import "firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZL642_1kx9Ah6oDEUs5pQDbkME5MObw4",
  authDomain: "techno-9b7eb.firebaseapp.com",
  databaseURL: "https://techno-9b7eb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "techno-9b7eb",
  storageBucket: "techno-9b7eb.appspot.com",
  messagingSenderId: "374236940896",
  appId: "1:374236940896:web:e1e7ac070b11eee96c9105",
  measurementId: "G-03X8754ZGF",
}

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// Initialize Firestore
const db = firebase.firestore()

export { db }

