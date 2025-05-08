import Header from "./components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative  flex items-center justify-center p-8 pb-20 gap-16 sm:p-20">
        <div className="relative z-10 text-center text-white space-y-4">
          <h1 className="text-4xl font-bold sm:text-6xl transition-transform transform hover:scale-105 hover:text-yellow-400">
            Welcome to Our Blog
          </h1>

          <p className="text-lg sm:text-xl transition-all duration-500 transform hover:scale-105 hover:text-gray-100">
            Explore insightful articles, stories, and inspiration. Stay updated
            with the latest trends in technology, lifestyle, and more!
          </p>

          <div className="flex justify-center mt-8">
            <Link
              href="/blogs"
              className="px-6 py-3 bg-yellow-500 text-white rounded-full text-lg font-semibold hover:bg-yellow-600 transition duration-300"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
