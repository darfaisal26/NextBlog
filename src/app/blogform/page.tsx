"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();

  const validateForm = () => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Title is required.");
    }

    if (!content.trim()) {
      errors.push("Content is required.");
    }

    if (content.length < 20) {
      errors.push("Content must be at least 20 characters.");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setValidationErrors([]);

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authorized.");
        return;
      }

      const response = await axios.post(
        "/createblog",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        router.push("/blogs");
      }
    } catch (err) {
      setError("Error creating post.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl relative z-20 border shadow-xl hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-3xl font-semibold text-blue-800 mb-6 ">
              Create a New Post
            </h1>

            {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
            {validationErrors.length > 0 && (
              <ul className="text-red-600 mb-4">
                {validationErrors.map((error, idx) => (
                  <li key={idx} className="font-medium">
                    {error}
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-medium text-white mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 cursor-pointer py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostForm;
