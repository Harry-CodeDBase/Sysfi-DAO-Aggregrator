// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgnSh0DIaRyvZDCRsCG2Xrl8DLqt5tPDo",
  authDomain: "huxxle.firebaseapp.com",
  projectId: "huxxle",
  storageBucket: "huxxle.appspot.com",
  messagingSenderId: "467189248124",
  appId: "1:467189248124:web:8fc9c9f6d1fd42dedb59f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore and other services as needed
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
const analytics = getAnalytics(app);