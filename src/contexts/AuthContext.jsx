// src/db/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      const fakeUser = {
        userName: "Vinay",
        profilePhoto: "https://placehold.co/100x100",
        resourcesAccessed: [
          "Engineering Mathematics-I",
          "Basic Electrical Engineering",
        ],
        uploadApprove: "no",
        academicDetails: null, // include this
      };
      setUser(fakeUser);
      localStorage.setItem("authUser", JSON.stringify(fakeUser));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    }
  }, [user]);

  const loggedIn = user;

  return (
    <AuthContext.Provider value={{ user, setUser, loggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
