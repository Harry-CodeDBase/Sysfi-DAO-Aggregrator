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
  apiKey: "AIzaSyAMq_-pvAk2ifDB9VEwmcmcgnuClvL66Dw",
  authDomain: "sysfi-protocol.firebaseapp.com",
  databaseURL: "https://sysfi-protocol-default-rtdb.firebaseio.com",
  projectId: "sysfi-protocol",
  storageBucket: "sysfi-protocol.appspot.com",
  messagingSenderId: "201308188439",
  appId: "1:201308188439:web:30aa0cfe8c052590815152",
  measurementId: "G-J4HNBX6W1Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore and other services as needed
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, googleProvider, storage };
const analytics = getAnalytics(app);
