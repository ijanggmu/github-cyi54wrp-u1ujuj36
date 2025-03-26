'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Package,
  Receipt,
  Download,
  Plus,
  Loader2,
  Minus,
  Printer,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  date: string;
  total: number;
  status: 'completed' | 'refunded' | 'pending';
  paymentMethod: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [refundItems, setRefundItems] = useState<{ [key: string]: number }>({});
  const [partialRefund, setPartialRefund] = useState(false);
  const [refundPaymentMethod, setRefundPaymentMethod] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [refundTransaction, setRefundTransaction] = useState<Order | null>(null);

  // Sample data - replace with API call
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
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
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      date: '2024-03-20 15:45',
      total: 75.25,
      status: 'refunded',
      paymentMethod: 'Card',
      items: [
        {
          id: '3',
          name: 'Ibuprofen 200mg',
          quantity: 3,
          price: 8.99,
          discount: 5,
          total: 26.97,
        },
        {
          id: '4',
          name: 'Aspirin 100mg',
          quantity: 5,
          price: 5.99,
          discount: 0,
          total: 29.95,
        },
      ],
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'Mike Johnson',
      date: '2024-03-20 16:15',
      total: 200.00,
      status: 'pending',
      paymentMethod: 'PhonePe',
      items: [
        {
          id: '5',
          name: 'Naproxen 500mg',
          quantity: 4,
          price: 12.99,
          discount: 0,
          total: 51.96,
        },
        {
          id: '6',
          name: 'Hydrochlorothiazide 25mg',
          quantity: 2,
          price: 15.99,
          discount: 0,
          total: 31.98,
        },
      ],
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefundQuantityChange = (itemId: string, change: number) => {
    setRefundItems((prev) => {
      const currentQuantity = prev[itemId] || 0;
      const newQuantity = Math.max(0, Math.min(
        selectedOrder?.items.find(item => item.id === itemId)?.quantity || 0,
        currentQuantity + change
      ));
      
      if (newQuantity === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [itemId]: newQuantity,
      };
    });
  };

  const calculateRefundTotal = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.items.reduce((total, item) => {
      const refundQuantity = refundItems[item.id] || 0;
      return total + (item.price * refundQuantity * (1 - item.discount / 100));
    }, 0);
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    
    if (!refundReason) {
      toast({
        title: 'Refund reason required',
        description: 'Please provide a reason for the refund.',
        variant: 'destructive',
      });
      return;
    }

    if (!refundPaymentMethod) {
      toast({
        title: 'Payment method required',
        description: 'Please select a refund payment method.',
        variant: 'destructive',
      });
      return;
    }

    if (Object.keys(refundItems).length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select items to refund.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Create refund transaction
      const refundAmount = calculateRefundTotal();
      const refundTransaction: Order = {
        id: `REF-${Date.now()}`,
        orderNumber: `REF-${selectedOrder.orderNumber}`,
        customerName: selectedOrder.customerName,
        date: new Date().toLocaleString(),
        total: -refundAmount, // Negative amount for refund
        status: 'completed',
        paymentMethod: refundPaymentMethod,
        items: selectedOrder.items
          .filter(item => refundItems[item.id] > 0)
          .map(item => ({
            ...item,
            quantity: refundItems[item.id],
            total: -(item.price * refundItems[item.id] * (1 - item.discount / 100))
          }))
      };

      setRefundTransaction(refundTransaction);
      setShowSuccessDialog(true);
      
      toast({
        title: 'Refund processed',
        description: `Order #${selectedOrder.orderNumber} has been refunded successfully.`,
      });

      setShowRefundDialog(false);
      setSelectedOrder(null);
      setRefundReason('');
      setRefundItems({});
      setRefundPaymentMethod('');
      setPartialRefund(false);
      
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track all your orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/pos">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {order.items.length} items
                      </div>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        {order.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === 'completed' && (
                        <Dialog open={showRefundDialog && selectedOrder?.id === order.id} onOpenChange={setShowRefundDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 px-3 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 text-sm font-medium"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Receipt className="h-3.5 w-3.5" />
                              Refund
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Process Refund</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Order Details</Label>
                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order Number:</span>
                                    <span className="font-medium">#{order.orderNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer:</span>
                                    <span className="font-medium">{order.customerName}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Select Items to Refund</Label>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Refund Qty</TableHead>
                                        <TableHead className="text-right">Refund Amount</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items.map((item) => {
                                        const refundQuantity = refundItems[item.id] || 0;
                                        const refundAmount = item.price * refundQuantity * (1 - item.discount / 100);
                                        return (
                                          <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">
                                              <div className="flex items-center justify-end gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() => handleRefundQuantityChange(item.id, -1)}
                                                >
                                                  <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center">{refundQuantity}</span>
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() => handleRefundQuantityChange(item.id, 1)}
                                                >
                                                  <Plus className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-right">${refundAmount.toFixed(2)}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                  <span>Total Refund Amount:</span>
                                  <span>${calculateRefundTotal().toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Refund Payment Method</Label>
                                <Select value={refundPaymentMethod} onValueChange={setRefundPaymentMethod}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="phonepe">PhonePe</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                  </SelectContent>
                                </Select>
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
                                  onClick={() => {
                                    setShowRefundDialog(false);
                                    setSelectedOrder(null);
                                    setRefundReason('');
                                    setRefundItems({});
                                    setRefundPaymentMethod('');
                                    setPartialRefund(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={handleRefund}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    'Confirm Refund'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Successful</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {refundTransaction && (
              <>
                <div className="space-y-2">
                  <Label>Refund Transaction Details</Label>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-medium">#{refundTransaction.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium text-destructive">
                        ${Math.abs(refundTransaction.total).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium">{refundTransaction.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{refundTransaction.date}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refundTransaction.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right text-destructive">
                            ${Math.abs(item.total).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Total Refund Amount:</span>
                  <span className="text-destructive">
                    ${Math.abs(refundTransaction.total).toFixed(2)}
                  </span>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowSuccessDialog(false)}
              >
                Close
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Add print functionality here
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 