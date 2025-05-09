"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import axios from "@/lib/axios";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const isAdmin = role === "ADMIN";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="hover:text-gray-300 transition duration-200"
          >
            Next Blog
          </Link>
        </h1>

        <button onClick={toggleMenu} className="sm:hidden text-white">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/blogs">
                <button className="bg-transparent border px-4 py-2 rounded text-white transition">
                  Blogs
                </button>
              </Link>

              {isAdmin && (
                <Link href="/blogform">
                  <button className="bg-transparent border px-4 py-2 rounded text-white transition">
                    Add Blog
                  </button>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-transparent border px-4 py-2 rounded text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-transparent border px-4 py-2 rounded text-white transition hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-transparent border px-4 py-2 rounded text-white transition hover:bg-green-600">
                  Signup
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col space-y-2 bg-gray-800">
          {isLoggedIn ? (
            <>
              <Link href="/blogs">
                <button className="w-full bg-transparent border px-4 py-2 rounded text-white transition text-left">
                  Blogs
                </button>
              </Link>
              {isAdmin && (
                <Link href="/blogform">
                  <button className="w-full bg-transparent border px-4 py-2 rounded text-white transition text-left">
                    Add Blog
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full bg-transparent border px-4 py-2 rounded text-white transition text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="w-full bg-transparent border px-4 py-2 rounded text-white transition text-left hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="w-full bg-transparent border px-4 py-2 rounded text-white transition text-left hover:bg-green-600">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
