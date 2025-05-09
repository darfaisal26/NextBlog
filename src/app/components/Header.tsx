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
    <div className="flex items-center gap-2 text-white hover:text-blue-400 transition">
      {Icon && <Icon size={18} />}
      {href ? (
        <Link href={href}>{label}</Link>
      ) : (
        <button onClick={onClick} className="text-left">
          {label}
        </button>
      )}
    </div>
  );

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-300 transition">
            Next Blog
          </Link>
        </h1>

        <button onClick={toggleMenu} className="sm:hidden text-white">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 bg-gray-800 text-sm">
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
      )}
    </header>
  );
}
