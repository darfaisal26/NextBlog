"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Header from "./Header";

interface PostData {
  title: string;
  content: string;
}

interface EditPostClientProps {
  id: string;
  initialPostData: PostData;
}

export default function EditPostClient({
  id,
  initialPostData,
}: EditPostClientProps) {
  const router = useRouter();
  const [post, setPost] = useState<PostData>(initialPostData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      setError("No token found.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/blogs/${id}`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post updated successfully.");
      router.push("/blogs");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl relative z-20 border">
            <h1 className="text-3xl font-semibold text-white mb-6 text-center sm:text-left">
              Edit Post
            </h1>

            {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-medium text-white mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  className="w-full px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-lg font-medium text-white mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows={6}
                  value={post.content}
                  onChange={(e) =>
                    setPost({ ...post, content: e.target.value })
                  }
                  className="w-full px-4 py-2 text- border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
