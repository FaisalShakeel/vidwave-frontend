import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaRsYloQUeCWqtuWETxHBN9hTtEAfRliM",
  authDomain: "clone-3ac6e.firebaseapp.com",
  projectId: "clone-3ac6e",
  storageBucket: "clone-3ac6e.appspot.com",
  messagingSenderId: "479116050539",
  appId: "1:479116050539:web:95c2ce1a8ba6dfc0bf712e"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
//const DB = getFirestore(app);
const storage = getStorage(app);

export { storage };
