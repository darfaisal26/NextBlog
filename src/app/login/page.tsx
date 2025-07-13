"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setMessage("All fields are required.");
      setMessageType("error");
      return false;
    }
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

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
      setMessageType("success");

      // Smooth transition to blogs page
      setTimeout(() => {
        router.push("/blogs");
      }, 1000);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || "Login failed. Try again.";
      setMessage(errMsg);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/15 to-orange-500/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      {/* Login form container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Welcome header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-white/70 text-lg">Sign in to your account</p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="group relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:bg-white/15 hover:border-white/30"
        >
          {/* Form glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Email input */}
          <div className="relative mb-6">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/10 text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                focusedField === "email"
                  ? "border-blue-400 bg-white/20 shadow-lg shadow-blue-500/20"
                  : "border-white/20 hover:border-white/40"
              }`}
            />
            {focusedField === "email" && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-md -z-10"></div>
            )}
          </div>

          {/* Password input */}
          <div className="relative mb-6">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 bg-white/10 text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                focusedField === "password"
                  ? "border-blue-400 bg-white/20 shadow-lg shadow-blue-500/20"
                  : "border-white/20 hover:border-white/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {focusedField === "password" && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-md -z-10"></div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`relative w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 overflow-hidden group ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </span>
          </button>

          {/* Message display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl border transition-all duration-300 ${
                messageType === "success"
                  ? "bg-green-500/20 border-green-400/30 text-green-100"
                  : "bg-red-500/20 border-red-400/30 text-red-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}
        </form>

        {/* Footer text */}
        <div className="text-center mt-8">
          <p className="text-white/60">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-purple-500 rounded-full animate-ping animation-delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-500 rounded-full animate-pulse animation-delay-500"></div>
      </div>
    </main>
  );
}