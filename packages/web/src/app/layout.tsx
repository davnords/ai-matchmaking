import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import ThemeProvider from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner-toaster";
import LoadingArray from "@/components/ui/loading-array";
import NavigationMenuComponent from "./NavigationMenu";
import { TooltipProvider } from "@/components/ui/tooltip";


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
        <TooltipProvider>
          <body className={inter.className}>
            <Toaster position="top-right" />
            <ThemeProvider>
              <NavigationMenuComponent />
              {children}
            </ThemeProvider>
          </body>
        </TooltipProvider>
      </AuthProvider>
    </html>
  );
}
