import EditPostClient from "@/app/components/EditPostClient";
import { getPostData } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PostData {
  title: string;
  content: string;
}

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const postData = await getPostData(id);
    return {
      title: `Edit: ${postData.title}`,
      description: `Edit the blog post "${postData.title}"`,
      robots: "noindex, nofollow", // Don't index edit pages
    };
  } catch (error) {
    return {
      title: "Edit Post",
      description: "Edit blog post",
      robots: "noindex, nofollow",
    };
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  let postData: PostData;
  let error: string | null = null;

  try {
    postData = await getPostData(id);

    // Validate that we have the required data
    if (!postData || typeof postData !== "object") {
      throw new Error("Invalid post data received");
    }

    // Ensure we have the required fields with defaults
    postData = {
      title: postData.title || "",
      content: postData.content || "",
    };
  } catch (err: any) {
    console.error("Error fetching post for editing:", err);

    // Handle different error types
    if (err.response?.status === 404) {
      notFound();
    }

    if (err.response?.status === 401 || err.response?.status === 403) {
      error = "You don't have permission to edit this post.";
    } else {
      error = "Failed to load post data. Please try again.";
    }

    // Provide fallback data
    postData = { title: "", content: "" };
  }

  // If we have an error, render an error page
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-red-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-400 mb-2">
                Unable to Edit Post
              </h1>
              <p className="text-red-300 mb-6">{error}</p>
              <a
                href="/blogs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Blogs
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <EditPostClient id={id} initialPostData={postData} />
    </div>
  );
}