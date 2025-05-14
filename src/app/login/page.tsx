"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Eye } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setMessage("All fields are required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post("/login", formData);
      const { token, role, userid } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userid", userid);
      window.localStorage.setItem("token", token);
      setMessage("Login successful!");
      router.push("/blogs");
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || "Login failed. Try again.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen ">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/30 border border-white/40 p-8 rounded-xl shadow-xl w-full max-w-sm transition-all duration-300"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-white text-center drop-shadow">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full p-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full p-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 text-blue-500 bottom-8 cursor-pointer"
          >
            <Eye />
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-white/80">{message}</p>
        )}
      </form>
    </main>
  );
}
