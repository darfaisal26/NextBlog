import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "@/lib/axios";
import jwt from "jsonwebtoken";
import Header from "../components/Header";
import BlogListClient from "../components/BlogListClient";

export const revalidate = 10;

export default async function BlogListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let posts = [];
  let role = "";

  try {
    const res = await axios.get("/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    posts = res.data;

    const decoded = jwt.decode(token);
    if (typeof decoded === "object" && decoded && "role" in decoded) {
      role = decoded.role as string;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main Content */}
      <BlogListClient posts={posts} role={role} token={token} />
    </div>
  );
}