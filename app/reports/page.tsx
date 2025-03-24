'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Download, LineChart, BarChart, PieChart } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const salesData = [
  {
    id: '1',
    date: '2024-03-20',
    customer: 'John Doe',
    items: 3,
    total: 150.00,
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-03-19',
    customer: 'Jane Smith',
    items: 2,
    total: 89.99,
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-03-18',
    customer: 'Bob Johnson',
    items: 5,
    total: 245.50,
    status: 'completed',
  },
];

const inventoryData = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    stock: 150,
    value: 1495.50,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    stock: 15,
    value: 299.85,
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    stock: 85,
    value: 1104.15,
    status: 'In Stock',
  },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [reportType, setReportType] = useState('sales');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', reportType, dateRange],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        salesData,
        inventoryData,
        totalSales: 25000,
        totalOrders: 450,
        averageOrderValue: 55.56,
      };
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-[calc(100vh-12rem)] p-8 space-y-8 overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            View and analyze your pharmacy performance
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Select defaultValue={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Report</SelectItem>
            <SelectItem value="inventory">Inventory Report</SelectItem>
          </SelectContent>
        </Select>
        <DatePicker />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData?.totalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData?.averageOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>
            {reportType === 'sales' ? 'Sales Overview' : 'Inventory Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {reportType === 'sales' ? (
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              ) : (
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {reportType === 'sales'
                ? salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell>${sale.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {sale.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                : inventoryData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>${item.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Low Stock'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}