"use client";

import Link from "next/link";
import ClientDate from "../components/ClientDate";
import axios from "@/lib/axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { deletePost } from "@/lib/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface AnimatedDot {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

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
  const [animatedDots, setAnimatedDots] = useState<AnimatedDot[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Generate random animated dots only on client side
    const dots: AnimatedDot[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));

    setAnimatedDots(dots);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-l from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-bounce delay-700"></div>
      </div>

      {/* Floating Particles - Only render on client */}
      <div className="absolute inset-0">
        {isClient &&
          animatedDots.map((dot) => (
            <div
              key={dot.id}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
              style={{
                left: dot.left,
                top: dot.top,
                animationDelay: dot.animationDelay,
                animationDuration: dot.animationDuration,
              }}
            />
          ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
              Blog Posts
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light tracking-wide transform transition-all duration-500 hover:scale-105 hover:text-yellow-300 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-2xl">
              Welcome to our blog! Here you'll find insightful posts on a
              variety of topics, from technology to personal stories. Stay
              updated with the latest articles and enjoy reading!
            </p>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-lg"></div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Main Card */}
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col justify-between h-full overflow-hidden">
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-300 group-hover:text-yellow-300 leading-tight">
                    {post.title}
                  </h2>

                  {/* Content Preview */}
                  <p className="text-white/80 mb-6 flex-1 leading-relaxed font-light">
                    {post.content.slice(0, 150)}...
                  </p>

                  {/* Image */}
                  {post.image && (
                    <div className="mb-6 overflow-hidden rounded-2xl shadow-lg">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-white/70 mt-auto mb-4">
                    <ClientDate createdAt={post.createdAt} />
                    <Link
                      href={`/blogs/${post.id}`}
                      className="flex items-center gap-2 text-yellow-300 hover:text-yellow-100 transition-all duration-300 transform hover:scale-110 px-3 py-1 rounded-full bg-yellow-300/10 hover:bg-yellow-300/20"
                    >
                      <Eye className="w-4 h-4" />
                      Read more
                    </Link>
                  </div>

                  {/* Admin Actions */}
                  {role === "ADMIN" && (
                    <div className="flex gap-3 mt-4">
                      <Link
                        href={`/blogs/edit/${post.id}`}
                        className="flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">📝</div>
            <h3 className="text-2xl font-bold text-white mb-4">No posts yet</h3>
            <p className="text-white/70 text-lg">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}