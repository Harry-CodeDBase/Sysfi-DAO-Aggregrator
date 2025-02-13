import React, { useState } from "react";
import { auth, db } from "../utils/Firebase";
import image from '../img/user.png';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import Type from "./Type";
import FloatingImage from "../components/ui/Floatingimage";
import FloatingImage2 from "../components/ui/Floatingimage2";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const checkUsernameAvailability = async (enteredUsername) => {
    const userRef = collection(db, "users");
    const usernameQuery = query(
      userRef,
      where("username", "==", enteredUsername)
    );
    const usernameSnapshot = await getDocs(usernameQuery);
    return usernameSnapshot.empty ? enteredUsername : `${enteredUsername}.syn`;
  };

  const createUserDocument = async (user, finalUsername) => {
    const userRef = doc(db, "users", user.uid);
    const invitePassCode = uuidv4().substring(0, 8);
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      username: finalUsername,
      invitePassCode,
      badge: "new",
      achievementBagde: [],
      community: 0,
    });
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const finalUsername = await checkUsernameAvailability(
        user.displayName || "user"
      );
      await createUserDocument(user, finalUsername);
      alert("Registered successfully with Google!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative p-5 background">
      <FloatingImage />
      <FloatingImage2 />
      <div className="w-full max-w-md p-6 bg-black bg-opacity-50 backdrop-blur-md border border-teal-400 rounded-2xl shadow-2xl relative z-10">
        <img className="block mx-auto" src={image } />

        <div className="text-center w-full">
          <Type />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form className="flex flex-wrap items-center justify-center gap-4">
          {["metamask", "rainbow", "coinbase", "walletConnect"].map(
            (wallet, index) => (
              <motion.div
                key={wallet}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <WalletButton wallet={wallet} />
              </motion.div>
            )
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
