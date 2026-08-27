// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Агора — B2B-каталог транспортной упаковки",
  description: "Каталог поставщиков транспортной упаковки",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
