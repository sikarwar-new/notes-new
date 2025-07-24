// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();

  // if user is not logged in, redirect to /login
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // else render the component
  return children;
}
