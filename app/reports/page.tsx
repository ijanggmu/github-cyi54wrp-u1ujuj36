'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Loader2,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Package,
  Users,
  Calendar,
  Search,
  Check,
  Clock,
  X,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
} from 'recharts';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader } from "@/components/ui/loader";

interface Report {
  id: string;
  title: string;
  type: string;
  format: string;
  status: 'completed' | 'pending' | 'failed';
  generatedAt: string;
  size: string;
  generatedBy: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReportType, setSelectedReportType] = useState<string>(searchParams.get('type') || 'all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reports, setReports] = useState<Report[]>([
  {
    id: '1',
      title: 'Monthly Sales Report',
      type: 'sales',
      format: 'PDF',
    status: 'completed',
      generatedAt: '2024-03-15 10:30 AM',
      size: '2.5 MB',
      generatedBy: 'John Doe',
  },
  {
    id: '2',
      title: 'Inventory Status',
      type: 'inventory',
      format: 'Excel',
      status: 'pending',
      generatedAt: '2024-03-15 09:15 AM',
      size: '1.8 MB',
      generatedBy: 'Jane Smith',
  },
  {
    id: '3',
      title: 'Customer Analytics',
      type: 'analytics',
      format: 'PDF',
      status: 'failed',
      generatedAt: '2024-03-15 08:45 AM',
      size: '3.2 MB',
      generatedBy: 'Mike Johnson',
    },
    {
      id: '4',
      title: 'Product Expiry Report',
      type: 'inventory',
      format: 'PDF',
      status: 'completed',
      generatedAt: '2024-03-14 14:20 PM',
      size: '1.4 MB',
      generatedBy: 'Jane Smith',
    },
    {
      id: '5',
      title: 'Top Selling Products',
      type: 'sales',
      format: 'Excel',
      status: 'completed',
      generatedAt: '2024-03-13 11:05 AM',
      size: '2.1 MB',
      generatedBy: 'John Doe',
    },
    {
      id: '6',
      title: 'Profit Margin Analysis',
      type: 'financial',
      format: 'PDF',
      status: 'completed',
      generatedAt: '2024-03-12 15:30 PM',
      size: '3.7 MB',
      generatedBy: 'Mike Johnson',
    },
  ]);

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000, profit: 2400 },
    { name: 'Feb', sales: 3000, profit: 1398 },
    { name: 'Mar', sales: 2000, profit: 9800 },
    { name: 'Apr', sales: 2780, profit: 3908 },
    { name: 'May', sales: 1890, profit: 4800 },
    { name: 'Jun', sales: 2390, profit: 3800 },
  ];

  const inventoryData = [
    { name: 'Pain Relief', value: 400 },
    { name: 'Antibiotics', value: 300 },
    { name: 'Vitamins', value: 300 },
    { name: 'First Aid', value: 200 },
    { name: 'Other', value: 200 },
  ];

  const customerData = [
    { name: 'Jan', new: 40, returning: 24 },
    { name: 'Feb', new: 30, returning: 13 },
    { name: 'Mar', new: 20, returning: 98 },
    { name: 'Apr', new: 27, returning: 39 },
    { name: 'May', new: 18, returning: 48 },
    { name: 'Jun', new: 23, returning: 38 },
  ];

  useEffect(() => {
    // Set initial report type from URL if provided
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedReportType(typeParam);
    }
  }, [searchParams]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || report.status === selectedStatus;
    const matchesType = 
      selectedReportType === 'all' || report.type === selectedReportType;
    
    // Date filtering
    let matchesDate = true;
    if (startDate || endDate) {
      const reportDate = new Date(report.generatedAt);
      if (startDate && reportDate < startDate) {
        matchesDate = false;
      }
      if (endDate) {
        // Set end date to end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (reportDate > endOfDay) {
          matchesDate = false;
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Create a new report entry
      const newReport = {
        id: `${reports.length + 1}`,
        title: 'New Generated Report',
        type: selectedReportType === 'all' ? 'sales' : selectedReportType,
        format: 'PDF',
        status: 'completed' as const,
        generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm a'),
        size: '1.2 MB',
        generatedBy: 'Current User',
      };
      
      setReports([newReport, ...reports]);
      
      toast({
        title: 'Report generated',
        description: 'Your report has been generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: 'Report downloaded',
        description: 'Your report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applyDateFilter = () => {
    setLoading(true);
    // Simulate loading state when applying filters
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage your pharmacy reports
          </p>
        </div>
        <Button onClick={handleGenerateReport} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue={selectedReportType === 'all' ? 'sales' : selectedReportType} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" onClick={() => setSelectedReportType('sales')}>
            <DollarSign className="mr-2 h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="inventory" onClick={() => setSelectedReportType('inventory')}>
            <Package className="mr-2 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="analytics" onClick={() => setSelectedReportType('analytics')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="financial" onClick={() => setSelectedReportType('financial')}>
            <PieChart className="mr-2 h-4 w-4" />
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                      <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Stock" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Paracetamol', current: 10, threshold: 20 },
                    { name: 'Amoxicillin', current: 5, threshold: 15 },
                    { name: 'Vitamin C', current: 8, threshold: 25 },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {item.current} | Threshold: {item.threshold}
                        </p>
                      </div>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={customerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="new"
                        stroke="#8884d8"
                        name="New Customers"
                      />
                      <Line
                        type="monotone"
                        dataKey="returning"
                        stroke="#82ca9d"
                        name="Returning Customers"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
      </div>
              </CardContent>
            </Card>

        <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Paracetamol', sales: 1500, revenue: 7500 },
                    { name: 'Vitamin C', sales: 1200, revenue: 6000 },
                    { name: 'Amoxicillin', sales: 800, revenue: 4000 },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Sales: {item.sales} | Revenue: ${item.revenue}
                        </p>
                      </div>
                      <Badge>Top Seller</Badge>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        name="Revenue"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
          </CardContent>
        </Card>

        <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Total Revenue', value: '$45,000' },
                    { label: 'Total Expenses', value: '$30,000' },
                    { label: 'Net Profit', value: '$15,000' },
                    { label: 'Profit Margin', value: '33.33%' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <p className="font-medium">{item.label}</p>
                      <p className="text-lg font-bold">{item.value}</p>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap" htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  className="w-[180px]"
                  value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setStartDate(date);
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap" htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  className="w-[180px]"
                  value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setEndDate(date);
                  }}
                />
              </div>
              
              <Button onClick={applyDateFilter} className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
              
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <Loader text="Loading reports..." />
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reports found matching your filters.</p>
            </div>
          ) : (
            <div className="rounded-md border">
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                    <TableHead>Generated At</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.format}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'completed'
                              ? 'default'
                              : report.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {report.status === 'completed' ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : report.status === 'pending' ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.generatedAt}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadReport(report.id)}
                            disabled={loading || report.status !== 'completed'}
                            title="Download Report"
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // View report details
                              toast({
                                title: 'View Report',
                                description: `Viewing details for ${report.title}`,
                              });
                            }}
                            title="View Report"
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}