'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  Clock,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Receipt,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { StockAlerts } from '@/components/dashboard/stock-alerts';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-store';

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample expired products data
  const expiredProducts = [
    {
      id: '1',
      name: 'Amoxicillin 250mg',
      expiryDate: '2024-03-15',
      stock: 45,
      status: 'expired',
    },
    {
      id: '2',
      name: 'Vitamin C 1000mg',
      expiryDate: '2024-04-10',
      stock: 30,
      status: 'expiring-soon',
    },
    {
      id: '3',
      name: 'Ibuprofen 200mg',
      expiryDate: '2024-04-01',
      stock: 20,
      status: 'expired',
    },
    {
      id: '4',
      name: 'Omeprazole 20mg',
      expiryDate: '2024-04-20',
      stock: 15,
      status: 'expiring-soon',
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Hi, {user?.name || 'User'}!</h2>
              <p className="text-muted-foreground">
                Welcome back to your dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {user?.role || 'User'}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="h-full p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/reports?type=sales" passHref>
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between space-y-2">
                <h3 className="tracking-tight text-sm font-medium">Total Sales</h3>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center pt-4">
                <div className="flex items-center">
                  <p className="text-2xl font-bold">$12,450</p>
                  <ArrowUp className="h-4 w-4 text-emerald-500 ml-2" />
                  <span className="text-emerald-500 text-sm ml-1">12%</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/customers" passHref>
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between space-y-2">
                <h3 className="tracking-tight text-sm font-medium">Total Customers</h3>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center pt-4">
                <div className="flex items-center">
                  <p className="text-2xl font-bold">1,234</p>
                  <ArrowUp className="h-4 w-4 text-emerald-500 ml-2" />
                  <span className="text-emerald-500 text-sm ml-1">8%</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/inventory" passHref>
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between space-y-2">
                <h3 className="tracking-tight text-sm font-medium">Total Products</h3>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center pt-4">
                <div className="flex items-center">
                  <p className="text-2xl font-bold">567</p>
                  <ArrowDown className="h-4 w-4 text-red-500 ml-2" />
                  <span className="text-red-500 text-sm ml-1">3%</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/inventory?filter=lowstock" passHref>
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between space-y-2">
                <h3 className="tracking-tight text-sm font-medium">Low Stock Items</h3>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center pt-4">
                <p className="text-2xl font-bold">24</p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Recent Transactions</h3>
                <Link href="/sales" passHref>
                  <Button variant="ghost" size="sm">
                    View All <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <RecentTransactions />
            </div>
          </Card>

          <Card className="col-span-3">
            <div className="p-6">
              <h3 className="text-xl font-semibold">Stock Alerts</h3>
              <StockAlerts />
            </div>
          </Card>
        </div>

        {/* Expired Products Section */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Expired/Expiring Products</h3>
              <Link href="/inventory?filter=expiring" passHref>
                <Button variant="ghost" size="sm">
                  View All <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {expiredProducts.map((product) => (
                <Card key={product.id} className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{product.name}</h4>
                      <Badge variant={product.status === 'expired' ? 'destructive' : 'secondary'}>
                        {product.status === 'expired' ? 'Expired' : 'Expiring Soon'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {product.expiryDate}
                    </div>
                    <div className="text-sm">
                      Stock: <span className="font-medium">{product.stock} units</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}