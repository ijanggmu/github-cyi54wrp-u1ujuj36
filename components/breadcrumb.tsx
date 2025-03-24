'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center hover:text-primary transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => (
        <div key={segment} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            href={`/${segments.slice(0, index + 1).join('/')}`}
            className="capitalize hover:text-primary transition-colors"
          >
            {segment}
          </Link>
        </div>
      ))}
    </nav>
  );
}