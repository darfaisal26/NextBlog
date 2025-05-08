"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setMessage("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/signup", formData);
      // setMessage(res.data.message);
      toast.success(res.data.message);
      router.push("/login");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Signup failed");
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/30 border border-white/20 p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Sign Up
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          required
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border border-white/40 bg-white/70 placeholder-gray-500 text-black w-full p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          required
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          className="border border-white/40 bg-white/70 placeholder-gray-500 text-black w-full p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </main>
  );
}
