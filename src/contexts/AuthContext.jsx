// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange, getUserDocument } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Get user document from Firestore
        const userDocument = await getUserDocument(firebaseUser.uid);
        setUserDoc(userDocument);
      } else {
        setUser(null);
        setUserDoc(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loggedIn = !!user;

  const updateUserDoc = (newData) => {
    setUserDoc(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userDoc, 
      setUser, 
      updateUserDoc,
      loggedIn, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
