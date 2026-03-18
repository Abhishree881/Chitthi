import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      console.log("Auth state changed:", user);

      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // Augment auth user with Firestore profile fields (e.g., photoURLLarge)
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        console.log("Loaded user profile from Firestore:", userDoc.data());
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data() });
        } else {
          setCurrentUser(user);
        }
      } catch (e) {
        console.error("Failed to load user profile", e);
        setCurrentUser(user);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
