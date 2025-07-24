// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Layout from "./Components/Layout.jsx";
import Resources from "./features/Resources/Resources.jsx";
import Sem from "./features/Resources/Sem.jsx";
import Result from "./features/Resources/Result.jsx";
import Profile from "./features/profile/Profile.jsx";
import Home from "./features/Home/Home.jsx";
import Login from "./features/auth/Login.jsx";
import Cart from "./Components/Cart.jsx";
import Branch from "./features/Resources/Branch.jsx"
import Particles from "./Components/Particles.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import RequestUpload from "./Components/RequestUpload.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/resources", element: <Resources /> },
      { path: "/branch/:year", element: <Branch /> },
      { path: "/sem/:year/:branch", element: <Sem /> },
      { path: "/results", element: <Result /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sell",
        element: (
          <ProtectedRoute>
            <RequestUpload />
          </ProtectedRoute>
        ),
      },
      { path: "/cart", element: <Cart /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
