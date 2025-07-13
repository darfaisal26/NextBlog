"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setMessage("Email and password are required");
      setMessageType("error");
      return false;
    }

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/signup", formData);
      toast.success(res.data.message);
      setMessage("Account created successfully! Redirecting to login...");
      setMessageType("success");

      // Smooth transition to login page
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setMessage(errorMessage);
      setMessageType("error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData((prev) => ({ ...prev, password: newPassword }));
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-green-500/10 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      {/* Signup form container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Welcome header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Join Us Today
          </h1>
          <p className="text-white/70 text-lg">
            Create your account to get started
          </p>
        </div>

        {/* Signup form */}
        <form
          onSubmit={handleSubmit}
          className="group relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:bg-white/15 hover:border-white/30"
        >
          {/* Form glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Email input */}
          <div className="relative mb-6">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/10 text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                focusedField === "email"
                  ? "border-green-400 bg-white/20 shadow-lg shadow-green-500/20"
                  : "border-white/20 hover:border-white/40"
              }`}
            />
            {focusedField === "email" && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-md -z-10"></div>
            )}
          </div>

          {/* Password input */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              required
              onChange={handlePasswordChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 bg-white/10 text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                focusedField === "password"
                  ? "border-green-400 bg-white/20 shadow-lg shadow-green-500/20"
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
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-md -z-10"></div>
            )}
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">
                  Password strength:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    passwordStrength <= 2
                      ? "text-red-400"
                      : passwordStrength <= 3
                      ? "text-yellow-400"
                      : passwordStrength <= 4
                      ? "text-blue-400"
                      : "text-green-400"
                  }`}
                >
                  {getStrengthText()}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`relative w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 overflow-hidden group ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
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
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-blue-500 rounded-full animate-ping animation-delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-500"></div>
      </div>
    </main>
  );
}