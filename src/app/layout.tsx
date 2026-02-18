import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Matcher — AI Tech Stack Recommender",
  description: "Describe your project, get the perfect tech stack recommended by AI and voted on by developers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-950`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
