import type { Metadata } from "next";
import { Suspense } from "react";
import NextAuthProvider from "@/components/NextAuthProvider";
import TopMenu from "@/components/TopMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportBook",
  description: "Sports Facility Booking System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">
        <NextAuthProvider>
          <Suspense fallback={<nav className="h-14 border-b bg-white" />}>
            <TopMenu />
          </Suspense>
          <main className="flex-1">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
