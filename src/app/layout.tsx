import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Stack Matcher — AI Tech Stack Recommender",
    template: "%s | Stack Matcher",
  },
  description: "Describe your project idea and get the perfect tech stack recommended by AI. Community-voted recommendations for developers.",
  keywords: ["tech stack", "AI recommendations", "developer tools", "software architecture", "technology picker"],
  openGraph: {
    title: "Stack Matcher — AI Tech Stack Recommender",
    description: "Describe your project idea and get the perfect tech stack recommended by AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Matcher — AI Tech Stack Recommender",
    description: "Describe your project idea and get the perfect tech stack recommended by AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
