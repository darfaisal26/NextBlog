import Header from "./components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative flex items-center justify-center p-8 pb-20 gap-16 sm:p-20 min-h-screen">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/40 to-black/70 animate-pulse"></div>

        {/* Glass morphism container */}
        <div className="relative z-10 text-center text-white space-y-8 backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl max-w-4xl">
          {/* Modern heading with gradient text */}
          <h1 className="text-5xl font-black sm:text-7xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent transition-all duration-700 hover:scale-105 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 drop-shadow-lg">
            Welcome to Our Blog
          </h1>

          {/* Enhanced description with better typography */}
          <p className="text-xl sm:text-2xl leading-relaxed font-light text-gray-100 transition-all duration-500 hover:scale-105 hover:text-white max-w-3xl mx-auto">
            Explore insightful articles, stories, and inspiration. Stay updated
            with the latest trends in technology, lifestyle, and more!
          </p>

          {/* Modern CTA button with enhanced styling */}
          <div className="flex justify-center mt-12">
            <Link
              href="/blogs"
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xl font-bold overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/25 active:scale-95"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl"></div>

              {/* Button content */}
              <span className="relative z-10 flex items-center gap-2">
                Explore More
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-orange-500 rounded-full animate-ping animation-delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-pink-500 rounded-full animate-pulse animation-delay-500"></div>
        </div>
      </div>
    </>
  );
}