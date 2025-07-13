import Header from "@/app/components/Header";
import axios from "../../../lib/axios";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 10;

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
}

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await axios.get(`/blogs/${id}`);
    const post: BlogPost = res.data;

    return {
      title: post.title,
      description: post.content.substring(0, 160) + "...",
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 160) + "...",
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;

  let post: BlogPost | null = null;
  let error: string | null = null;

  try {
    const res = await axios.get(`/blogs/${id}`);
    post = res.data;

    if (!post) {
      notFound();
    }
  } catch (err: any) {
    console.error("Error fetching blog post:", err);

    if (err.response?.status === 404) {
      notFound();
    }

    error = "Failed to load blog post. Please try again later.";
  }

  if (error) {
    return (
      <>
        <div className="relative z-10">
          <Header />
        </div>
        <div className="py-10 px-4">
          <div className="max-w-4xl mx-auto relative z-20">
            <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
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
                Error Loading Post
              </h1>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    notFound();
  }

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Process content paragraphs
  const contentParagraphs = post.content
    .split("\n")
    .filter((para) => para.trim() !== "")
    .map((para, idx) => (
      <p key={idx} className="mb-4 last:mb-0">
        {para}
      </p>
    ));

  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto relative z-20">
          <article className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>By {post.author}</span>
                  </div>
                )}

                {post.createdAt && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Published on {formatDate(post.createdAt)}</span>
                  </div>
                )}

                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Updated on {formatDate(post.updatedAt)}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-base sm:text-lg text-white leading-relaxed space-y-4">
                {contentParagraphs}
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-400">
                  <p>Thanks for reading!</p>
                </div>

                {/* <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Share
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Save
                  </button>
                </div> */}
              </div>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}