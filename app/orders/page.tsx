'use client';

import { useState, useEffect } from 'react';
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
  Edit2,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
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
import { Loader } from "@/components/ui/loader";
import { getOrders, createOrder, updateOrder, deleteOrder, updateOrderStatus, updatePaymentStatus } from '@/lib/db/orders';
import { Order, OrderItem } from '@/lib/db/orders';
import { getProducts } from '@/lib/db/products';
import { getCustomers } from '@/lib/db/customers';
import { Product } from '@/lib/db/products';
import { Customer } from '@/lib/db/customers';

export default function OrdersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_id: '',
    status: 'pending' as const,
    payment_status: 'pending' as const,
    notes: '',
    total_amount: 0,
  });
  const [orderItems, setOrderItems] = useState<{
    product_id: string;
    quantity: number;
    price: number;
  }[]>([]);

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadCustomers();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load customers. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customers?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.includes(searchQuery) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrder = async () => {
    if (!newOrder.customer_id || orderItems.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please select a customer and add at least one item.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createOrder(newOrder, orderItems);
      await loadOrders();
      setShowAddDialog(false);
      setNewOrder({
        customer_id: '',
        status: 'pending',
        payment_status: 'pending',
        notes: '',
        total_amount: 0,
      });
      setOrderItems([]);
      
      toast({
        title: 'Order added',
        description: 'New order has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    setLoading(true);
    try {
      await updateOrderStatus(id, status);
      await loadOrders();
      
      toast({
        title: 'Status updated',
        description: 'Order status has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (id: string, payment_status: Order['payment_status']) => {
    setLoading(true);
    try {
      await updatePaymentStatus(id, payment_status);
      await loadOrders();
      
      toast({
        title: 'Payment status updated',
        description: 'Payment status has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    setLoading(true);
    try {
      await deleteOrder(id);
      await loadOrders();
      
      toast({
        title: 'Order deleted',
        description: 'Order has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updatedItems = [...orderItems];
    if (field === 'product_id') {
      updatedItems[index] = { ...updatedItems[index], [field]: String(value) };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setOrderItems(updatedItems);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy orders
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={newOrder.customer_id}
                  onValueChange={(value) =>
                    setNewOrder({ ...newOrder, customer_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Order Items</Label>
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Select
                          value={item.product_id}
                          onValueChange={(value) => {
                            const product = products.find(p => p.id === value);
                            updateOrderItem(index, 'product_id', value);
                            updateOrderItem(index, 'price', product?.price || 0);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateOrderItem(index, 'quantity', parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateOrderItem(index, 'price', parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOrderItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addOrderItem}
                    className="w-full"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, notes: e.target.value })
                  }
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAddOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Order'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader text="Loading orders..." />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customers?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.payment_status}
                          onValueChange={(value: Order['payment_status']) =>
                            handleUpdatePaymentStatus(order.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>Order ID</Label>
                                    <p>{selectedOrder.id}</p>
                                  </div>
                                  <div>
                                    <Label>Customer</Label>
                                    <p>{selectedOrder.customers?.name}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p>{selectedOrder.status}</p>
                                  </div>
                                  <div>
                                    <Label>Payment Status</Label>
                                    <p>{selectedOrder.payment_status}</p>
                                  </div>
                                  <div>
                                    <Label>Total Amount</Label>
                                    <p>${selectedOrder.total_amount.toFixed(2)}</p>
                                  </div>
                                  {selectedOrder.notes && (
                                    <div>
                                      <Label>Notes</Label>
                                      <p>{selectedOrder.notes}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label>Order Items</Label>
                                    <div className="space-y-2">
                                      {selectedOrder.order_items?.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                          <span>{item.products?.name}</span>
                                          <span>
                                            {item.quantity} x ${item.price.toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Select
                            value={order.status}
                            onValueChange={(value: Order['status']) =>
                              handleUpdateStatus(order.id, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
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