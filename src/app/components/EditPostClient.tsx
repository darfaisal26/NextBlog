"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Header from "./Header";

export default function EditPostClient() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        console.log("Fetching post with ID:", id);
        const response = await axios.get(`/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data, "response data");
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load post.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/blogs/edit/${id}`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post updated successfully.");
      router.push("/blogs");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  if (loading)
    return (
      <p className="flex justify-center  text-black min-h-screen items-center ">
        Loading...
      </p>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className=" py-10 px-4 ">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl relative z-20 border  ">
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
