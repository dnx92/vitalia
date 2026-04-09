import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/layout";
import { ToastProvider } from "@/components/ui/toast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vitalia - America's Healthcare Marketplace",
  description: "Connect with top-verified medical specialists across the United States. Book appointments, pay securely, and track your health.",
  keywords: ["medical services", "healthcare", "doctors", "appointments", "health tracking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 pt-[70px]">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
