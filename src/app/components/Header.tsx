"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import axios from "@/lib/axios";
import {
  Menu,
  X,
  BookOpen,
  FilePlus,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

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
    return () => window.removeEventListener("storage", checkAuthState);
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

  const MenuItem = ({
    href,
    label,
    icon: Icon,
    onClick,
  }: {
    href?: string;
    label: string;
    icon: React.ElementType;
    onClick?: () => void;
  }) => (
    <div className="group flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
      {Icon && (
        <Icon
          size={18}
          className="transition-all duration-300 group-hover:text-blue-400 group-hover:scale-110"
        />
      )}
      {href ? (
        <Link
          href={href}
          className="relative overflow-hidden rounded-lg px-3 py-2 transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm"
        >
          <span className="relative z-10">{label}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="relative overflow-hidden rounded-lg px-3 py-2 text-left transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm group"
        >
          <span className="relative z-10">{label}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-orange-500/0 group-hover:from-red-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
        </button>
      )}
    </div>
  );

  return (
    <header className="relative bg-gradient-to-r from-gray-900/95 via-slate-900/95 to-gray-900/95 backdrop-blur-xl text-white shadow-2xl border-b border-white/10">
      {/* Header glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-pulse"></div>

      <div className="relative max-w-screen-xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Enhanced logo */}
        <h1 className="text-3xl font-black">
          <Link
            href="/"
            className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-all duration-500 hover:scale-105 active:scale-95"
          >
            Next Blog
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 hover:opacity-20 blur-xl rounded-lg transition-all duration-500"></div>
          </Link>
        </h1>

        {/* Enhanced mobile menu button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <div className="relative">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300"></div>
          </div>
        </button>

        {/* Enhanced desktop navigation */}
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <MenuItem href="/blogs" label="Blogs" icon={BookOpen} />
              {isAdmin && (
                <MenuItem href="/blogform" label="Add Blog" icon={FilePlus} />
              )}
              <MenuItem label="Logout" icon={LogOut} onClick={handleLogout} />
            </>
          ) : (
            <>
              <MenuItem href="/login" label="Login" icon={LogIn} />
              <MenuItem href="/signup" label="Signup" icon={UserPlus} />
            </>
          )}
        </nav>
      </div>

      {/* Enhanced mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-6 pb-6 flex flex-col gap-4 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-xl text-sm border-t border-white/10">
            {isLoggedIn ? (
              <>
                <MenuItem href="/blogs" label="Blogs" icon={BookOpen} />
                {isAdmin && (
                  <MenuItem href="/blogform" label="Add Blog" icon={FilePlus} />
                )}
                <MenuItem label="Logout" icon={LogOut} onClick={handleLogout} />
              </>
            ) : (
              <>
                <MenuItem href="/login" label="Login" icon={LogIn} />
                <MenuItem href="/signup" label="Signup" icon={UserPlus} />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}