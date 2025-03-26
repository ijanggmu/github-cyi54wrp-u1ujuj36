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
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Wallet,
  UserPlus,
  Loader2,
  Package,
  X,
  Check,
  Percent,
  Receipt,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import Link from 'next/link';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
  description?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', icon: <Wallet className="h-5 w-5" /> },
  { id: 'card', name: 'Card', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'phonepe', name: 'PhonePe', icon: <QrCode className="h-5 w-5" /> },
  { id: 'upi', name: 'UPI', icon: <Receipt className="h-5 w-5" /> },
];

export default function POSPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      price: 5.99,
      stock: 100,
      category: 'Pain Relief',
      costPrice: 3.50,
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      price: 12.99,
      stock: 50,
      category: 'Antibiotics',
      costPrice: 8.00,
    },
    {
      id: '3',
      name: 'Vitamin C 1000mg',
      price: 15.99,
      stock: 75,
      category: 'Vitamins',
      costPrice: 10.00,
    },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [orderId, setOrderId] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+0987654321',
      email: 'jane@example.com',
      address: '456 Oak Ave',
    },
  ]);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = cartTotal * (globalDiscount / 100);
  const finalTotal = cartTotal - discountAmount;

  const handleAddToCart = (product: Medicine) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: 'Stock limit reached',
          description: 'Cannot add more items than available stock.',
          variant: 'destructive',
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.price * (item.quantity + 1)) * (1 - item.discount / 100),
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          discount: 0,
          total: product.price,
        },
      ]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: 'Stock limit reached',
        description: 'Cannot add more items than available stock.',
        variant: 'destructive',
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, quantity),
              total: (item.price * Math.max(0, quantity)) * (1 - item.discount / 100),
            }
          : item
      )
    );
  };

  const handleUpdateItemDiscount = (id: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              discount: Math.max(0, Math.min(100, discount)),
              total: (item.price * item.quantity) * (1 - Math.max(0, Math.min(100, discount)) / 100),
            }
          : item
      )
    );
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const customer: Customer = {
        id: `${customers.length + 1}`,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        address: newCustomer.address,
      };

      setCustomers([...customers, customer]);
      setSelectedCustomer(customer);
      setShowCustomerDialog(false);
      setNewCustomer({});

      toast({
        title: 'Customer added',
        description: 'New customer has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart empty',
        description: 'Please add items to cart before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedCustomer) {
      setShowCustomerDialog(true);
      return;
    }

    if (!paymentMethod) {
      setShowPaymentDialog(true);
      return;
    }

    if (paymentMethod === 'phonepe') {
      setShowQRCode(true);
      setPaymentStatus('pending');
      
      // Simulate payment processing
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setPaymentStatus('success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Process successful payment
        await processSuccessfulPayment();
      } catch (error) {
        setPaymentStatus('failed');
        toast({
          title: 'Payment failed',
          description: 'Failed to process payment. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    setLoading(true);
    try {
      await processSuccessfulPayment();
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processSuccessfulPayment = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate order ID
    const newOrderId = `ORD${Date.now()}`;
    setOrderId(newOrderId);

    // Update stock
    setProducts(products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity,
        };
      }
      return product;
    }));

    // Clear cart and reset state
    setCart([]);
    setPaymentMethod('');
    setGlobalDiscount(0);
    setShowQRCode(false);
    setShowPaymentDialog(false);
    setShowSuccessDialog(true);

    toast({
      title: 'Payment successful',
      description: `Order #${newOrderId} has been processed successfully.`,
    });
  };

  const handlePrintReceipt = () => {
    // Implement receipt printing logic
    window.print();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">
            Process sales and manage transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/orders">
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              View Transactions
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Left side - Product List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAddToCart(product)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        </div>
                        <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">${product.price.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground">
                            Stock: {product.stock}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Cart */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Shopping Cart</CardTitle>
                  <Badge variant="secondary" className="font-normal">
                    {cart.length} items
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerDialog(true)}
                >
                  {selectedCustomer ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedCustomer.name}</span>
                      <X
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(null);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Select Customer</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="flex flex-col h-full">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-2">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="grid grid-cols-5 gap-4 items-center p-4 bg-card hover:bg-accent/50 rounded-xl transition-all group border border-border hover:border-accent shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <div>
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-md">
                              <Percent className="h-3 w-3" />
                              <Input
                                type="number"
                                value={item.discount}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (isNaN(value) || value < 0) {
                                    handleUpdateItemDiscount(item.id, 0);
                                  } else if (value > 100) {
                                    handleUpdateItemDiscount(item.id, 100);
                                  } else {
                                    handleUpdateItemDiscount(item.id, value);
                                  }
                                }}
                                min="0"
                                max="100"
                                className="h-8 w-20 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <span>%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.total.toFixed(2)}</div>
                            {item.discount > 0 && (
                              <div className="text-xs text-destructive">
                                -${((item.price * item.quantity) - item.total).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
                <div className="border-t pt-4 mt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Global Discount</span>
                        <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-md">
                          <Percent className="h-3 w-3" />
                          <Input
                            type="number"
                            value={globalDiscount}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value) || value < 0) {
                                setGlobalDiscount(0);
                              } else if (value > 100) {
                                setGlobalDiscount(100);
                              } else {
                                setGlobalDiscount(value);
                              }
                            }}
                            min="0"
                            max="100"
                            className="h-8 w-20 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <span className="text-destructive">
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Total Amount:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base font-semibold"
                    onClick={handlePayment}
                    disabled={cart.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Pay ${finalTotal.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Selection Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select or Add Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search Customer</Label>
              <Input placeholder="Search by name or phone..." />
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerDialog(false);
                    }}
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                    {selectedCustomer?.id === customer.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="space-y-2">
              <Label>Add New Customer</Label>
              <Input
                placeholder="Name"
                value={newCustomer.name || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={newCustomer.phone || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
              <Input
                placeholder="Email (optional)"
                value={newCustomer.email || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
              <Input
                placeholder="Address (optional)"
                value={newCustomer.address || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />
              <Button
                className="w-full"
                onClick={handleAddCustomer}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Customer'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={paymentMethod === method.id ? 'default' : 'outline'}
                  className="w-full h-16 flex flex-col gap-2"
                  onClick={() => {
                    setPaymentMethod(method.id);
                    if (method.id === 'phonepe') {
                      setShowQRCode(true);
                    }
                  }}
                >
                  {method.icon}
                  <span>{method.name}</span>
                </Button>
              ))}
            </div>
            {paymentMethod === 'phonepe' && showQRCode && (
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
                <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-lg relative">
                  <QrCode className="w-full h-full text-primary" />
                  {paymentStatus === 'pending' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}
                  {paymentStatus === 'success' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/50 rounded-lg">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                  {paymentStatus === 'failed' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/50 rounded-lg">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with PhonePe to complete payment
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQRCode(false);
                      setPaymentStatus('pending');
                    }}
                  >
                    Cancel
                  </Button>
                  {paymentStatus === 'pending' && (
                    <Button
                      onClick={() => handlePayment()}
                      disabled={loading}
                    >
                      Payment Done
                    </Button>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={loading || !paymentMethod || (paymentMethod === 'phonepe' && showQRCode)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Payment'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              Payment Successful
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">#{orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{selectedCustomer?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={handlePrintReceipt}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `/orders/${orderId}`;
                }}
              >
                View Order Details
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowSuccessDialog(false);
                  setSelectedCustomer(null);
                }}
              >
                New Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}