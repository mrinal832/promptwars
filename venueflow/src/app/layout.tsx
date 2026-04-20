import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "VenueFlow AI - Smart Stadium Experience",
  description: "Next-generation venue management and attendee experience platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="glow-bg-1"></div>
        <div className="glow-bg-2"></div>
        {children}
      </body>
    </html>
  );
}
