import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Package,
  Receipt,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { StockAlerts } from '@/components/dashboard/stock-alerts';

export default function Home() {
  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
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

        <Card className="p-6">
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

        <Card className="p-6">
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

        <Card className="p-6">
          <div className="flex items-center justify-between space-y-2">
            <h3 className="tracking-tight text-sm font-medium">Low Stock Items</h3>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center pt-4">
            <p className="text-2xl font-bold">24</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
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
    </div>
  );
}