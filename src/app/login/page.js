"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setMessage("❌ Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem(
            "auth",
            JSON.stringify({ username: data.user.username, token: data.token })
          );
        }
        setUser({ username: data.user.username });
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.error || "❌ Login failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4"
              />
              Remember Me
            </label>
            <a href="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition duration-300 disabled:opacity-50`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.p
              key="message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 text-center font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
