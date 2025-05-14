"use client";

import Link from "next/link";
import ClientDate from "../components/ClientDate";
import axios from "@/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { deletePost } from "@/lib/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface BlogListClientProps {
  posts: any[];
  role: string;
  token: string;
}

export default function BlogListClient({
  posts: initialPosts,
  role,
  token,
}: BlogListClientProps) {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = async (id: number) => {
    // console.log("Deleting post with ID:", id, typeof id);
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const res = await deletePost(id, token);
        if (res.status === 200) {
          toast.success("Post deleted successfully.");
          setPosts(posts.filter((post) => post.id !== id));
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete the post.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
          Blog Posts
        </h1>
        <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto transition-all duration-300 hover:scale-150 ease-in-out hover:text-yellow-400 px-4 py-2 rounded-lg">
          Welcome to our blog! Here you'll find insightful posts on a variety of
          topics, from technology to personal stories. Stay updated with the
          latest articles and enjoy reading!
        </p>
      </div>

      <div className="grid grid-cols-1 relative z-10 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="backdrop-blur-md bg-white/20 border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between"
          >
            <h2 className="text-2xl font-semibold text-white mb-2 drop-shadow-lg">
              {post.title}
            </h2>

            <p className="text-sm text-white/90 mb-4 flex-1">
              {post.content.slice(0, 150)}...
            </p>
            {post.image ? (
              <div className="">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={200}
                  height={100}
                  className="rounded-lg object-cover  mb-4"
                />
              </div>
            ) : null}

            <div className="flex justify-between items-center text-sm text-white/70 mt-auto">
              <ClientDate createdAt={post.createdAt} />
              <Link
                href={`/blogs/${post.id}`}
                className="flex items-center gap-1 text-yellow-300 hover:text-yellow-100 transition"
              >
                <Eye className="w-4 h-4" />
                Read more
              </Link>
            </div>

            {role === "ADMIN" && (
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/blogs/edit/${post.id}`}
                  className="flex items-center justify-center gap-2 text-sm text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center justify-center gap-2 text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
