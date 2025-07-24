import React, { use, useState } from "react";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, setUser, loggedIn } = useAuth();

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-amber-100 via-white to-amber-200">
      <div className="w-[90%] max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
        <div className="text-center mb-6">
          <img className="w-12 mx-auto mb-2" src={Logo} alt="Logo" />
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to CollabeNote
          </h2>
          <p className="text-gray-500 text-sm">
            {isSignUp
              ? "Create your account to get started"
              : "Sign in to continue"}
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="passw" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="passw"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPass" className="text-sm text-gray-700">
                Re-enter Password
              </label>
              <input
                type="password"
                id="confirmPass"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            onClick={() => {
              setUser(true);
            }}
            type="submit"
            className="bg-orange-500 text-white font-semibold rounded-lg py-2 mt-2 hover:bg-orange-600 transition-all duration-300"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 font-medium cursor-pointer ml-1 hover:underline"
          >
            {isSignUp ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
