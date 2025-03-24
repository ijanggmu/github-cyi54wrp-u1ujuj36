'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  ShoppingCart,
  Settings,
  Moon,
  Sun,
  LineChart,
  ChevronLeft,
  Shield,
  UserCog,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    color: 'text-sky-500',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/customers',
    color: 'text-violet-500',
  },
  {
    label: 'Suppliers',
    icon: Truck,
    href: '/suppliers',
    color: 'text-pink-700',
  },
  {
    label: 'Inventory',
    icon: Package,
    href: '/inventory',
    color: 'text-orange-700',
  },
  {
    label: 'Point of Sale',
    icon: ShoppingCart,
    href: '/pos',
    color: 'text-emerald-500',
  },
  {
    label: 'Reports',
    icon: LineChart,
    href: '/reports',
    color: 'text-blue-500',
  },
  {
    label: 'Roles',
    icon: Shield,
    href: '/roles',
    color: 'text-red-500',
    adminOnly: true,
  },
  {
    label: 'Users',
    icon: UserCog,
    href: '/users',
    color: 'text-purple-500',
    adminOnly: true,
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredRoutes = routes.filter(
    (route) => !route.adminOnly || user?.role === 'admin'
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300',
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={toggleSidebar}
      />

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'h-screen sticky top-0 bg-card border-r shadow-sm z-40 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          isMobile && 'fixed',
          isMobile && isCollapsed && '-translate-x-full'
        )}
      >
        {/* Collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute -right-3 top-6 hidden lg:flex h-6 w-6 rounded-full border shadow-sm bg-background',
            isCollapsed ? 'rotate-180' : ''
          )}
          onClick={toggleSidebar}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Sidebar content */}
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 px-4 mb-8',
              isCollapsed ? 'justify-center' : 'px-6'
            )}
          >
            <Package className={cn('h-6 w-6', !isCollapsed && 'text-primary')} />
            {!isCollapsed && (
              <span className="font-bold text-xl">PharmaCare</span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-2 overflow-y-auto">
            <div className="space-y-1">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    pathname === route.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                    isCollapsed && 'justify-center px-0'
                  )}
                  title={isCollapsed ? route.label : undefined}
                >
                  <route.icon
                    className={cn('h-5 w-5 shrink-0', route.color)}
                  />
                  {!isCollapsed && <span>{route.label}</span>}
                </Link>
              ))}
            </div>
          </nav>

          {/* Theme toggle */}
          <div className={cn('px-2 mt-6', isCollapsed && 'flex justify-center')}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={cn('w-full', isCollapsed ? 'w-auto' : 'justify-start')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {!isCollapsed && <span className="ml-3">Toggle theme</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}