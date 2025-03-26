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
  { id: 'phonepe', name: 'PhonePe', icon: <Receipt className="h-5 w-5" /> },
  { id: 'upi', name: 'UPI', icon: <Receipt className="h-5 w-5" /> },
];

export default function POSPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate loading medicines
    setMedicines([
      {
        id: '1',
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        price: 5.99,
        costPrice: 3.50,
        stock: 100,
        image: '/medicines/paracetamol.jpg',
        description: 'Pain relief and fever reducer',
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 12.99,
        costPrice: 8.00,
        stock: 50,
        image: '/medicines/amoxicillin.jpg',
        description: 'Antibiotic medication',
      },
      // Add more sample medicines...
    ]);

    // Simulate loading customers
    setCustomers([
      {
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        address: '123 Main St',
      },
      // Add more sample customers...
    ]);
  }, []);

  const categories = Array.from(new Set(medicines.map(m => m.category)));

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === medicine.id);
      if (existingItem) {
        if (existingItem.quantity >= medicine.stock) {
          toast({
            title: 'Stock limit reached',
            description: 'Cannot add more items than available stock.',
            variant: 'destructive',
          });
          return prev;
        }
        return prev.map((item) =>
          item.id === medicine.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.price * (item.quantity + 1)) * (1 - item.discount / 100),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: 1,
          discount: 0,
          total: medicine.price,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
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

  const updateItemDiscount = (id: string, discount: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (globalDiscount / 100);
  const total = subtotal - discountAmount;

  const handlePayment = async () => {
    if (!selectedCustomer) {
      setShowCustomerDialog(true);
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Cart empty',
        description: 'Please add items to cart before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedPaymentMethod === 'phonepe') {
      setShowQRCode(true);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: 'Payment successful',
        description: `Order total: $${total.toFixed(2)}`,
      });

      // Clear cart and reset
      setCartItems([]);
      setSelectedCustomer(null);
      setGlobalDiscount(0);
      setSelectedPaymentMethod('cash');
      setShowQRCode(false);
      setOrderId(crypto.randomUUID());
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: 'Required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const customer: Customer = {
        id: crypto.randomUUID(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        address: newCustomer.address,
      };

      setCustomers((prev) => [...prev, customer]);
      setSelectedCustomer(customer);
      setIsCustomerDialogOpen(false);
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

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Point of Sale</h2>
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-2">
                  {filteredMedicines.map((medicine) => (
                    <Card
                      key={medicine.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(medicine)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">{medicine.category}</Badge>
                        </div>
                        <h3 className="font-medium text-sm mb-1">{medicine.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">${medicine.price.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground">
                            Stock: {medicine.stock}
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
                    {cartItems.length} items
                  </Badge>
                </div>
                <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
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
                  </DialogTrigger>
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
                                setIsCustomerDialogOpen(false);
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
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-5 gap-4 mb-4 text-sm font-medium text-muted-foreground px-4">
                  <div className="pl-7">Item</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Quantity</div>
                  <div className="text-right">Discount</div>
                  <div className="text-right">Total</div>
                </div>
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-2">
                    <AnimatePresence>
                      {cartItems.map((item) => (
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
                              onClick={() => removeFromCart(item.id)}
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
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                                    updateItemDiscount(item.id, 0);
                                  } else if (value > 100) {
                                    updateItemDiscount(item.id, 100);
                                  } else {
                                    updateItemDiscount(item.id, value);
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
                      <span>${subtotal.toFixed(2)}</span>
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
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Discount</span>
                      <span className="text-destructive">
                        -${(subtotal - total).toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Total Amount:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base font-semibold"
                    onClick={handlePayment}
                    disabled={cartItems.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Pay ${total.toFixed(2)}
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
            <DialogTitle>Select Customer</DialogTitle>
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
                  variant={selectedPaymentMethod === method.id ? 'default' : 'outline'}
                  className="w-full h-16 flex flex-col gap-2"
                  onClick={() => {
                    setSelectedPaymentMethod(method.id);
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
            {selectedPaymentMethod === 'phonepe' && showQRCode && (
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
                <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-lg">
                  <img
                    src="/phonepe-qr.png"
                    alt="PhonePe QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with PhonePe to complete payment
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowQRCode(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowQRCode(false);
                      handlePayment();
                    }}
                  >
                    Payment Done
                  </Button>
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
                disabled={loading || !selectedPaymentMethod}
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
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{selectedCustomer?.name}</span>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  // Handle print receipt
                  window.print();
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Handle view order details
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
                  setCartItems([]);
                  setSelectedCustomer(null);
                  setGlobalDiscount(0);
                  setSelectedPaymentMethod('cash');
                  setShowQRCode(false);
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