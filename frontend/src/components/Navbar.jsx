import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Load login state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // Handlers
  const toggleAuth = () => {
    setShowAuth(!showAuth);
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/logout");
    } catch (e) {
      console.error("Logout error:", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login / Signup
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin
      ? "http://localhost:4000/api/login"
      : "http://localhost:4000/api/signup";

    try {
      const resp = await axios.post(endpoint, form);
      const { token, user } = resp.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        setShowAuth(false);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      setError(msg);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <nav className="font-roboto fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.08)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-gray-50">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-500 bg-clip-text text-transparent"
          >
            Deepfake Detector
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-10">
            {["Home", "Predict", "About"].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-gray-200 hover:text-cyan-400 transition font-medium"
                >
                  {item}
                </Link>
                <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"></span>
              </motion.div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">
                  Hi, <span className="text-cyan-400">{user.name}</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 text-black font-semibold hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] transition"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAuth}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-semibold hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] transition"
              >
                {isLogin ? "Login" : "Signup"}
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <Link
            to="#"
            className="md:hidden text-3xl hover:text-cyan-400 transition"
          >
            ☰
          </Link>
        </div>
      </nav>

      {/* ================= AUTH MODAL ================= */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0a1124]/90 border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,255,255,0.2)] w-[90%] max-w-sm text-center text-white"
            >
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h2>

              <form
                onSubmit={handleAuthSubmit}
                className="flex flex-col gap-4 text-left"
              >
                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 mt-4 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-semibold hover:shadow-[0_0_25px_rgba(0,191,255,0.5)] transition"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </motion.button>

                {error && (
                  <p className="text-red-400 text-sm mt-2 text-center">
                    {error}
                  </p>
                )}
              </form>

              <p className="mt-4 text-sm text-gray-400">
                {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleForm}
                  className="text-cyan-400 hover:text-pink-400 transition font-semibold"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>

              <button
                onClick={toggleAuth}
                className="mt-6 text-gray-400 hover:text-cyan-400 transition text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
