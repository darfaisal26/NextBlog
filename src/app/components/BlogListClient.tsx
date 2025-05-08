"use client";

import Link from "next/link";
import ClientDate from "../components/ClientDate";
import axios from "@/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { deletePost } from "@/lib/api";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="backdrop-blur-md bg-white/20 border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between"
          >
            <h2 className="text-2xl font-semibold text-white mb-2 drop-shadow-lg">
              {post.title}
            </h2>
            <p className="text-sm text-white/80 mb-4 flex-1">
              {post.content.slice(0, 150)}...
            </p>
            <ClientDate createdAt={post.createdAt} />

            <Link
              href={`/blogs/${post.id}`}
              className="inline-block mt-4 text-blue-400 hover:text-blue-200 font-medium transition-colors"
            >
              Read more →
            </Link>

            {role === "ADMIN" && (
              <div className="mt-4 flex space-x-2">
                <Link
                  href={`/blogs/edit/${post.id}`}
                  className="text-white bg-transparent border cursor-pointer border-white px-6 py-1 rounded transition-all hover:bg-white/20"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-white bg-red-500 cursor-pointer hover:bg-red-600 px-6 py-1 rounded transition-all"
                >
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
