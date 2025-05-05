import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Surat Dinas App",
  description: "Aplikasi pengelolaan surat dinas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
