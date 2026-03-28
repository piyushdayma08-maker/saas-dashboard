import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowDesk Dashboard",
  description: "Production-style SaaS dashboard frontend with role-based UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
            <div className="w-full text-center">
              <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-900 text-sm py-1">
                Demo project — data may reset. Use for evaluation only.
              </div>
            </div>
            <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
