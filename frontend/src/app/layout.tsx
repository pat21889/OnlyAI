import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import NextAuthProvider from "@/components/NextAuthProvider";
import TopMenu from "@/components/TopMenu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "SportBook",
  description: "Sports Facility Booking System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${space.variable}`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans">
        <NextAuthProvider>
          <Suspense fallback={<nav className="h-16 border-b border-[#E8D9D6] bg-white" />}>
            <TopMenu />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={<footer className="mt-16 h-48 bg-[#1f1214]" />}>
            <Footer />
          </Suspense>
        </NextAuthProvider>
      </body>
    </html>
  );
}
