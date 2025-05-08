"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import axios from "@/lib/axios";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    const storedRole = localStorage.getItem("role") || Cookies.get("role");

    setIsLoggedIn(!!token);
    setRole(storedRole ?? null);

    const checkAuthState = () => {
      const newToken = localStorage.getItem("token") || Cookies.get("token");
      const newRole = localStorage.getItem("role") || Cookies.get("role");
      setIsLoggedIn(!!newToken);
      setRole(newRole ?? null);
    };

    window.addEventListener("storage", checkAuthState);

    return () => {
      window.removeEventListener("storage", checkAuthState);
    };
  }, []);

  const isAdmin = role === "ADMIN";

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      localStorage.clear();
      setIsLoggedIn(false);
      setRole(null);

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold text-white">
        <Link
          href="/"
          className="text-white hover:text-gray-300 transition duration-200"
        >
          Next Blog
        </Link>
      </h1>
      <nav className="flex items-center space-x-6">
        {isLoggedIn ? (
          <div className="flex items-center space-x-6">
            <Link href="/blogs">
              <button className="bg-transparent border cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Blogs
              </button>
            </Link>

            {isAdmin && (
              <Link href="/blogform">
                <button className="bg-transparent border cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                  Add Blog
                </button>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-transparent border cursor-pointer text-white px-6 py-2 rounded-lg  transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-transparent border text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-transparent border text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                Signup
              </button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
