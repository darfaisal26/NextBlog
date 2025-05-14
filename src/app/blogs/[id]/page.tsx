import Header from "@/app/components/Header";
import axios from "../../../lib/axios";
import { notFound } from "next/navigation";

export const revalidate = 10;

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await axios.get(`/blogs/${id}`);
  const posts = res.data;

  if (!posts) {
    notFound();
  }

  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto relative z-20   rounded-3xl p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            {posts.title}
          </h1>

          <div className="text-base sm:text-lg text-white leading-relaxed space-y-4">
            {posts.content.split("\n").map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
