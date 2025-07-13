import Image from "next/image";
import "./globals.css";

export const metadata = {
  title: "Next App",
  description: "Created with App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        {/* Enhanced background with parallax effect */}
        <div className="fixed inset-0 z-0">
          <Image
            src="https://st2.depositphotos.com/4107269/7705/i/450/depositphotos_77053627-stock-photo-journalist-working-on-his-new.jpg"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="opacity-40 object-cover transform scale-105 hover:scale-110 transition-transform duration-[3000ms]"
          />

          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/70"></div>

          {/* Subtle animated mesh gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
        </div>

        {/* Content wrapper with enhanced styling */}
        <div className="relative z-10 min-h-screen">{children}</div>

        {/* Decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-5">
          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-yellow-400/15 to-orange-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-2xl animate-bounce-slow"></div>
        </div>
      </body>
    </html>
  );
}