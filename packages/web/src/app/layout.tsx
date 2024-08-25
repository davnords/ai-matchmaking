import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import ThemeProvider from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner-toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI matchmaking",
  description: "Find your cofounder at Antler through AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Toaster position="top-right" />
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
