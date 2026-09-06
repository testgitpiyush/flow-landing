import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Flow | Master your productivity",
    template: "%s | Flow",
  },
  description: "The modern productivity app tailored for deep work. Streamline tasks, eliminate context switching, and achieve peak productivity.",
  keywords: ["productivity", "task manager", "deep work", "flow state", "team alignment"],
  authors: [{ name: "Flow Technologies, Inc." }],
  creator: "Flow Technologies, Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flow-landing.com",
    title: "Flow | Master your productivity",
    description: "The modern productivity app tailored for deep work.",
    siteName: "Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow | Master your productivity",
    description: "The modern productivity app tailored for deep work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-50 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col`}>
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}