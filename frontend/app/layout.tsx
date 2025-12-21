import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { SidebarProvider } from "@/lib/SidebarContext";
import { AuthProvider } from "@/lib/AuthProvider";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeMind - AI Trading Consultant",
  description: "Next-generation AI trading assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <AuthProvider>
          <SidebarProvider>
            <Sidebar />
            <main className="md:pl-[280px] min-h-screen pb-[100px] md:pb-0 relative animate-in fade-in duration-500 transition-all">
              {children}
            </main>
            <BottomNav />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
