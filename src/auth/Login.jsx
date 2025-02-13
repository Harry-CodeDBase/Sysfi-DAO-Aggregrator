import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Loader from "../utils/Loader";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const firebaseErrorMessages = {
    "auth/invalid-email": "Invalid email address.",
    "auth/user-disabled": "This user has been disabled.",
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "Incorrect password.",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        firebaseErrorMessages[error.code] ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-6 bg-opacity-50 backdrop-blur-md border border-teal-400 rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900">
        <h2 className="text-teal-400 text-3xl font-semibold mb-6 text-center">
          Welcome Back!
        </h2>

        {isLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div>
              <input
                type="password"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-teal-400 text-gray-900 font-semibold hover:bg-teal-500 transition"
            >
              Log in
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        )}

        <div className="mt-6 text-center text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-teal-400 hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link
              to="/reset-password"
              className="text-teal-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
