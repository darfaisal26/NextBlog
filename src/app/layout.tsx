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
      <body>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://st2.depositphotos.com/4107269/7705/i/450/depositphotos_77053627-stock-photo-journalist-working-on-his-new.jpg"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="opacity-50"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
