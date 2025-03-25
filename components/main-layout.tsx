import Sidebar from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { Breadcrumb } from '@/components/breadcrumb';
import { Footer } from '@/components/footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
} 