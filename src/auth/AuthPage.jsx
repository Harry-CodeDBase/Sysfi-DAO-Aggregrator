import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

const AuthPage = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [invitePass, setInvitePass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "signup" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log({ email, password, confirmPassword, country, invitePass });
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-96 p-6 shadow-2xl rounded-2xl bg-gradient-to-br from-teal-400 via-purple-500 to-black">
          <div className="p-4">
            <h2 className="text-3xl font-bold text-teal-300 text-center">
              {type === "signup"
                ? "Sign Up"
                : type === "reset"
                ? "Reset Password"
                : "Login"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 rounded border border-gray-600 bg-black text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {type !== "reset" && (
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 rounded border border-gray-600 bg-black text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              {type === "signup" && (
                <>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full p-2 rounded border border-gray-600 bg-black text-white"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Country"
                      className="w-full p-2 rounded border border-gray-600 bg-black text-white"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Invite Pass (if any)"
                      className="w-full p-2 rounded border border-gray-600 bg-black text-white"
                      value={invitePass}
                      onChange={(e) => setInvitePass(e.target.value)}
                    />
                  </div>
                </>
              )}
              <button
                className="w-full bg-teal-400 hover:bg-purple-600 text-black p-2 rounded"
                type="submit"
              >
                {type === "signup"
                  ? "Create Account"
                  : type === "reset"
                  ? "Reset Password"
                  : "Login"}
              </button>
            </form>
            {type === "login" && (
              <div className="text-center mt-4">
                <Link to="/reset" className="text-teal-300 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AuthWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/signup" element={<AuthPage type="signup" />} />
        <Route path="/reset" element={<AuthPage type="reset" />} />
      </Routes>
      <div className="text-center mt-4">
        <Link to="/signup" className="text-teal-300 hover:underline mr-4">
          Don&apos;t have an account? Sign Up
        </Link>
        <Link to="/login" className="text-teal-300 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </Router>
  );
};

export default AuthWrapper;
