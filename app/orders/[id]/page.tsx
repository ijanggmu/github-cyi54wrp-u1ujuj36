'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Printer,
  Download,
  Receipt,
  Package,
  User,
  CreditCard,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'completed' | 'refunded' | 'pending';
  paymentMethod: string;
  items: OrderItem[];
  notes?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data - replace with API call
  const order: Order = {
    id: params.id,
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    customerEmail: 'john@example.com',
    date: '2024-03-20 14:30',
    total: 150.50,
    status: 'completed',
    paymentMethod: 'Cash',
    items: [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        quantity: 2,
        price: 5.99,
        discount: 0,
        total: 11.98,
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        quantity: 1,
        price: 12.99,
        discount: 10,
        total: 11.69,
      },
    ],
    notes: 'Customer requested express delivery',
  };

  const handleRefund = async () => {
    if (!refundReason) {
      toast({
        title: 'Refund reason required',
        description: 'Please provide a reason for the refund.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: 'Refund processed',
        description: 'The order has been refunded successfully.',
      });

      setShowRefundDialog(false);
      // Update order status in your state management
    } catch (error) {
      toast({
        title: 'Refund failed',
        description: 'Failed to process refund. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
            <p className="text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {item.discount > 0 && (
                            <span className="text-destructive">-{item.discount}%</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Customer</span>
              </div>
              <div>
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Payment Method</span>
              </div>
              <div className="font-medium">{order.paymentMethod}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <div className="font-medium">{order.date}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Status</span>
              </div>
              <Badge
                variant={
                  order.status === 'completed'
                    ? 'default'
                    : order.status === 'refunded'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {order.status}
              </Badge>
            </div>
            {order.notes && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Notes</span>
                </div>
                <div className="text-sm">{order.notes}</div>
              </div>
            )}
            {order.status === 'completed' && (
              <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Process Refund
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Refund</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Refund Amount</Label>
                      <div className="text-2xl font-semibold">${order.total.toFixed(2)}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Refund</Label>
                      <Input
                        placeholder="Enter reason for refund..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowRefundDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleRefund}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Confirm Refund'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 