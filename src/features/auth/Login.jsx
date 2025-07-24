import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "../../services/authService";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { loggedIn } = useAuth();

  // Redirect if already logged in
  if (loggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
      }
      if (!displayName.trim()) {
        setError("Display name is required");
        setLoading(false);
        return;
      }
      
      const { user, error } = await signUpWithEmail(email, password, displayName);
      if (error) {
        setError(error);
      }
    } else {
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      }
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    
    const { user, error } = await signInWithGoogle();
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          {isSignUp && (
            <div>
              <label htmlFor="displayName" className="text-sm text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="••••••••"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPass" className="text-sm text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPass"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="••••••••"
                required={isSignUp}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-semibold rounded-lg py-2 mt-2 hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg py-2 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

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
