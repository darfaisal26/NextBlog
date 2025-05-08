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
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <BlogListClient posts={posts} role={role} token={token} />
    </>
  );
}
