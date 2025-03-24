import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Sidebar from '@/components/sidebar';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/navbar';
import { Breadcrumb } from '@/components/breadcrumb';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PharmaCare - Pharmacy Management System',
  description: 'Modern pharmacy management system for efficient operations',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
                <Navbar />
                <div className="px-4 sm:px-6 lg:px-8 py-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <Breadcrumb />
                </div>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                  <div className="container mx-auto max-w-7xl">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}