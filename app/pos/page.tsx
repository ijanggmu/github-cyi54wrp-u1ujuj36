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
import {
  getProducts,
  getCustomers,
  createOrder,
  getOrderById,
  getRecentOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getProductStock,
  Order,
  OrderItem,
  CartItem,
  createCustomer,
} from '@/lib/db/pos';
import { Product } from '@/lib/db/products';
import { Customer } from '@/lib/db/customers';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaymentMethod {
  id: Order['payment_method'];
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
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Order['payment_method']>('cash');
  const [orderId, setOrderId] = useState('');
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [globalTax, setGlobalTax] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [productPage, setProductPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [productTotal, setProductTotal] = useState(0);
  const [customerTotal, setCustomerTotal] = useState(0);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  const [loadingMoreCustomers, setLoadingMoreCustomers] = useState(false);
  const pageSize = 10;
  const [debouncedProductSearch, setDebouncedProductSearch] = useState('');
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery === '') {
        loadInitialData();
        return;
      }

      setLoading(true);
      try {
        const response = await getProducts(1, pageSize, searchQuery);
        if (response.error) throw response.error;
        
        setProducts(response.data || []);
        setProductTotal(response.count || 0);
      } catch (error) {
        console.error('Error searching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to search products.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchProducts, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const searchCustomers = async () => {
      if (customerSearchQuery === '') {
        loadInitialData();
        return;
      }

      setLoading(true);
      try {
        const response = await getCustomers(1, pageSize, customerSearchQuery);
        if (response.error) throw response.error;
        
        setCustomers(response.data || []);
        setCustomerTotal(response.count || 0);
      } catch (error) {
        console.error('Error searching customers:', error);
        toast({
          title: 'Error',
          description: 'Failed to search customers.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchCustomers, 500);
    return () => clearTimeout(timer);
  }, [customerSearchQuery]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [productsResponse, customersResponse] = await Promise.all([
        getProducts(1, pageSize, ''),
        getCustomers(1, pageSize, ''),
      ]);

      if (productsResponse.error) throw productsResponse.error;
      if (customersResponse.error) throw customersResponse.error;

      setProducts(productsResponse.data || []);
      setCustomers(customersResponse.data || []);
      setProductTotal(productsResponse.count || 0);
      setCustomerTotal(customersResponse.count || 0);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMoreProducts || productPage * pageSize >= productTotal) return;
    
    setLoadingMoreProducts(true);
    try {
      const nextPage = productPage + 1;
      const response = await getProducts(nextPage, pageSize, searchQuery);
      
      if (response.error) throw response.error;
      
      setProducts(prev => [...prev, ...(response.data || [])]);
      setProductPage(nextPage);
    } catch (error) {
      console.error('Error loading more products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more products.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMoreProducts(false);
    }
  };

  const loadMoreCustomers = async () => {
    if (loadingMoreCustomers || customerPage * pageSize >= customerTotal) return;
    
    setLoadingMoreCustomers(true);
    try {
      const nextPage = customerPage + 1;
      const response = await getCustomers(nextPage, pageSize, customerSearchQuery);
      
      if (response.error) throw response.error;
      
      setCustomers(prev => [...prev, ...(response.data || [])]);
      setCustomerPage(nextPage);
    } catch (error) {
      console.error('Error loading more customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more customers.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMoreCustomers(false);
    }
  };

  const handleProductSearch = (query: string) => {
    setSearchQuery(query);
    setProductPage(1);
  };

  const handleCustomerSearch = (query: string) => {
    setCustomerSearchQuery(query);
    setCustomerPage(1);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = cartSubtotal * (globalDiscount / 100);
  const taxAmount = (cartSubtotal - discountAmount) * (globalTax / 100);
  const finalTotal = cartSubtotal - discountAmount + taxAmount;

  const handleAddToCart = async (product: Product) => {
    try {
      const stockResponse = await getProductStock(product.id);
      if (stockResponse.error) throw stockResponse.error;
      const stock = stockResponse.data;

      if (stock <= 0) {
        toast({
          title: 'Out of stock',
          description: 'This product is currently out of stock.',
          variant: 'destructive',
        });
        return;
      }

      const existingItem = cart.find(item => item.product_id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= stock) {
          toast({
            title: 'Stock limit reached',
            description: 'Cannot add more items than available stock.',
            variant: 'destructive',
          });
          return;
        }
        handleUpdateQuantity(product.id, existingItem.quantity + 1);
      } else {
        setCart(prev => [...prev, {
          product_id: product.id,
          name: product.name,
          quantity: 1,
          unit_price: product.price,
          discount_amount: 0,
          total: product.price,
        }]);
      }
    } catch (error) {
      console.error('Error checking stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to check product stock',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.product_id !== id));
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const stock = await getProductStock(id);
    if (quantity > stock) {
      toast({
        title: 'Error',
        description: 'Not enough stock available.',
        variant: 'destructive',
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.product_id === id
          ? {
              ...item,
              quantity: Math.max(0, quantity),
              total: (item.unit_price * Math.max(0, quantity)) - item.discount_amount,
            }
          : item
      )
    );
  };

  const handleUpdateItemDiscount = (id: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.product_id === id
          ? {
              ...item,
              discount_amount: Math.max(0, Math.min(item.unit_price * item.quantity, discount)),
              total: (item.unit_price * item.quantity) - Math.max(0, Math.min(item.unit_price * item.quantity, discount)),
            }
          : item
      )
    );
  };

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newCustomer, error } = await createCustomer(customerData);
      if (error) throw error;
      
      setCustomers(prev => [...prev, newCustomer]);
      setSelectedCustomer(newCustomer);
      setShowCustomerDialog(false);
      toast({
        title: 'Success',
        description: 'Customer added successfully',
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to add customer',
        variant: 'destructive',
      });
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

    if (paymentMethod === 'phonepe' || paymentMethod === 'upi') {
      setShowQRCode(true);
      setPaymentStatus('pending');
      
      // Simulate payment processing
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setPaymentStatus('success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Process successful payment
        await processOrder();
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
      await processOrder();
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

  const processOrder = async () => {
    if (!selectedCustomer) {
      toast({
        title: 'Error',
        description: 'Please select a customer',
        variant: 'destructive',
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: 'Error',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    try {
      const orderData: OrderFormData = {
        customer_id: selectedCustomer?.id,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
        })),
        payment_method: paymentMethod,
        discount_amount: globalDiscount,
        tax_amount: taxAmount,
      };

      const { data: order, error } = await createOrder(orderData);
      if (error) throw error;

      if (order) {
        setCurrentOrder(order);
        setShowSuccessDialog(true);
        setCart([]);
        setSelectedCustomer(null);
        setGlobalDiscount(0);
        setGlobalTax(0);
        setPaymentMethod('cash');
        setShowQRCode(false);
        setShowPaymentDialog(false);
        loadInitialData();
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to process order',
        variant: 'destructive',
      });
    }
  };

  const handlePrintReceipt = () => {
    if (!currentOrder) return;
    window.print();
  };

  if (loading) {
    return <Loader text="Loading POS..." />;
  }

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
              View Orders
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
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea 
                className="h-full pr-4"
                onScrollPositionChange={(position) => {
                  if (position.y > 0.8) {
                    loadMoreProducts();
                  }
                }}
              >
                <div className="space-y-2">
                  {products.map((product) => (
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
                          <span className="font-medium text-sm">₹{product.price?.toFixed(2)??'0.00'}</span>
                          <span className="text-xs text-muted-foreground">
                            Stock: {product.stock_quantity}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {loadingMoreProducts && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
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
                          key={item.product_id}
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
                              onClick={() => handleRemoveFromCart(item.product_id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <div>
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                ₹{item.unit_price?.toFixed(2)??'0.00'} each
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            ₹{item.unit_price?.toFixed(2)??'0.00'}
                          </div>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-md">
                              <Percent className="h-3 w-3" />
                              <Input
                                type="number"
                                value={item.discount_amount}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  handleUpdateItemDiscount(item.product_id, value);
                                }}
                                min="0"
                                max={item.unit_price * item.quantity}
                                className="h-8 w-20 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{item.total?.toFixed(2)??'0.00'}</div>
                            {item.discount_amount > 0 && (
                              <div className="text-xs text-destructive">
                                -₹{item.discount_amount?.toFixed(2)??'0.00'}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
                <div className="mt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartSubtotal?.toFixed(2)??'0.00'}</span>
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
                        -₹{discountAmount?.toFixed(2)??'0.00'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Tax</span>
                        <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-md">
                          <Percent className="h-3 w-3" />
                          <Input
                            type="number"
                            value={globalTax}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value) || value < 0) {
                                setGlobalTax(0);
                              } else if (value > 100) {
                                setGlobalTax(100);
                              } else {
                                setGlobalTax(value);
                              }
                            }}
                            min="0"
                            max="100"
                            className="h-8 w-20 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <span className="text-primary">
                        +₹{taxAmount?.toFixed(2)??'0.00'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span>Total Amount:</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{finalTotal?.toFixed(2)??'0.00'}
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
                        Pay ₹{finalTotal?.toFixed(2)??'0.00'}
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
              <Input
                placeholder="Search by name or phone..."
                value={customerSearchQuery}
                onChange={(e) => handleCustomerSearch(e.target.value)}
              />
            </div>
            <ScrollArea 
              className="h-[200px]"
              onScrollPositionChange={(position) => {
                if (position.y > 0.8) {
                  loadMoreCustomers();
                }
              }}
            >
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
              {loadingMoreCustomers && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </ScrollArea>
            <Separator />
            <div className="space-y-4">
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
                onClick={() => handleAddCustomer(newCustomer as Omit<Customer, 'id' | 'created_at' | 'updated_at'>)}
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
                    if (method.id === 'phonepe' || method.id === 'upi') {
                      setShowQRCode(true);
                    }
                  }}
                >
                  {method.icon}
                  <span>{method.name}</span>
                </Button>
              ))}
            </div>
            {showQRCode && (
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
                  Scan this QR code to complete payment
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
                <span className="font-medium">₹{finalTotal?.toFixed(2)??'0.00'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{selectedCustomer?.name || 'Walk-in Customer'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
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

      {/* Receipt Dialog */}
      {showReceipt && currentOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span>{currentOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(currentOrder.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{currentOrder.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{currentOrder.total_amount?.toFixed(2)??'0.00'}</span>
                </div>
                {currentOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Discount:</span>
                    <span>-₹{currentOrder.discount_amount?.toFixed(2)??'0.00'}</span>
                  </div>
                )}
                {currentOrder.tax_amount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Tax:</span>
                    <span>+₹{currentOrder.tax_amount?.toFixed(2)??'0.00'}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{currentOrder.total_amount?.toFixed(2)??'0.00'}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setShowReceipt(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}