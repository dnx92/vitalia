import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastProvider } from '@/components/ui/toast';
import { SessionProvider } from '@/components/providers/session-provider';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "Vitalia - America's Healthcare Marketplace",
  description: 'Connect with top-verified medical specialists across the United States.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <SessionProvider>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
