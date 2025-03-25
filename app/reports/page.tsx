'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Filter, Loader2, Search, BarChart, FileText, Users, DollarSign, Check, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportData {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  downloadUrl?: string;
  size?: string;
  generatedBy?: string;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: '1',
      title: 'Monthly Sales Report',
      type: 'sales',
      date: '2024-03-25',
      status: 'completed',
      downloadUrl: '/reports/sales-march-2024.pdf',
      size: '2.5 MB',
      generatedBy: 'John Doe',
    },
    {
      id: '2',
      title: 'Inventory Status Report',
      type: 'inventory',
      date: '2024-03-24',
      status: 'completed',
      downloadUrl: '/reports/inventory-march-2024.pdf',
      size: '1.8 MB',
      generatedBy: 'Jane Smith',
    },
    {
      id: '3',
      title: 'Customer Analytics Report',
      type: 'analytics',
      date: '2024-03-23',
      status: 'pending',
      generatedBy: 'Mike Johnson',
    },
    {
      id: '4',
      title: 'Financial Summary Report',
      type: 'financial',
      date: '2024-03-22',
      status: 'failed',
      generatedBy: 'Sarah Wilson',
    },
  ]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, selectedStatus]);

  const generateReport = async (type: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'Report generated successfully',
        description: 'Your report has been generated and is ready for download.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async (report: ReportData) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Report downloaded',
        description: 'Your report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download report. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: ReportData['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <DollarSign className="h-4 w-4" />;
      case 'inventory':
        return <FileText className="h-4 w-4" />;
      case 'analytics':
        return <BarChart className="h-4 w-4" />;
      case 'financial':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and manage your pharmacy reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Reports</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="analytics">Analytics Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                className="w-full"
                onClick={() => generateReport('sales')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
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
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="sales">Sales Reports</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics Reports</TabsTrigger>
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Generated By</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(report.type)}
                              <span>{report.title}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle capitalize">{report.type}</td>
                          <td className="p-4 align-middle">
                            {format(new Date(report.date), 'PPP')}
                          </td>
                          <td className="p-4 align-middle">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                getStatusColor(report.status)
                              )}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{report.size || '-'}</td>
                          <td className="p-4 align-middle">{report.generatedBy || '-'}</td>
                          <td className="p-4 align-middle">
                            {report.status === 'completed' && report.downloadUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => downloadReport(report)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {['sales', 'inventory', 'analytics', 'financial'].map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Generated By</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredReports
                          .filter((report) => report.type === type)
                          .map((report) => (
                            <tr
                              key={report.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle font-medium">
                                <div className="flex items-center space-x-2">
                                  {getTypeIcon(report.type)}
                                  <span>{report.title}</span>
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                {format(new Date(report.date), 'PPP')}
                              </td>
                              <td className="p-4 align-middle">
                                <span
                                  className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                    getStatusColor(report.status)
                                  )}
                                >
                                  {report.status}
                                </span>
                              </td>
                              <td className="p-4 align-middle">{report.size || '-'}</td>
                              <td className="p-4 align-middle">{report.generatedBy || '-'}</td>
                              <td className="p-4 align-middle">
                                {report.status === 'completed' && report.downloadUrl && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => downloadReport(report)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Download className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}