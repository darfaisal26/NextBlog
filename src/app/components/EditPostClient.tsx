"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import toast from "react-hot-toast";
import { updatePost } from "@/lib/api";

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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleInputChange = (field: keyof PostData, value: string) => {
    setPost((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const validateForm = (): boolean => {
    if (!token) {
      setError("Authentication required. Please log in again.");
      return false;
    }
    if (!post.title.trim()) {
      setError("Title is required.");
      return false;
    }
    if (!post.content.trim()) {
      setError("Content is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const trimmedPost = {
          title: post.title.trim(),
          content: post.content.trim(),
        };

        const res = await updatePost(id, trimmedPost, token!);

        if (res.status === 200) {
          toast.success("Post updated successfully!");
          router.push("/blogs");
          router.refresh(); // Refresh the page data
        }
      } catch (error: any) {
        console.error("Error updating post:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to update post. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const handleCancel = () => {
    router.push("/blogs");
  };

  if (!token) {
    return (
      <>
        <div className="relative z-10">
          <Header />
        </div>
        <div className="py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl relative z-20 border border-red-500/20 bg-red-500/10">
              <p className="text-red-400 text-center">
                Authentication required. Please log in to edit posts.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 p-8 rounded-2xl relative z-20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold text-white">Edit Post</h1>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isPending}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-medium text-white mb-2"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={post.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter post title..."
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-lg font-medium text-white mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows={8}
                  value={post.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className="w-full px-4 py-3 text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
                  placeholder="Write your post content here..."
                  required
                  disabled={isPending}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    "Update Post"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}