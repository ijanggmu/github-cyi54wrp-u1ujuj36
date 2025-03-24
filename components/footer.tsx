'use client';

import { Package } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-semibold">PharmaCare</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {currentYear} PharmaCare. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}