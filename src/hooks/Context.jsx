import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/Firebase"; // Import Firestore DB reference

// Create Auth Context
const AuthContext = createContext();

// Provide the current user and their additional details globally
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Store additional user details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Fetch additional user details from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid); // Assuming 'users' collection
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            setUserDetails(userSnapshot.data()); // Save additional details
          } else {
            console.warn("No user details found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setCurrentUser(null);
        setUserDetails(null);
      }
      setLoading(false); // Loading complete
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userDetails, loading, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
