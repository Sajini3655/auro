"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", cpassword: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.cpassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Save to localStorage & update context
        localStorage.setItem("auth", JSON.stringify({ username: data.user.username, token: data.token }));
        setUser({ username: data.user.username });
        setMessage("✅ Registration successful! Redirecting...");
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.error || "❌ Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none" />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none" />
          <input type="password" name="cpassword" placeholder="Confirm Password" onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none" />

          <button type="submit" disabled={loading} 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition duration-300 disabled:opacity-50">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>{message}</p>}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">Log in</a>
        </p>
      </div>
    </div>
  );
}
