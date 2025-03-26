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
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export default function POSPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol',
      category: 'Pain Relief',
      price: 5.99,
      costPrice: 3.50,
      stock: 100,
      image: '/medicines/paracetamol.jpg',
    },
    // Add more sample medicines...
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.medicine.id === medicine.id);
      if (existingItem) {
        if (existingItem.quantity >= medicine.stock) {
          toast({
            title: 'Out of stock',
            description: 'Not enough stock available.',
            variant: 'destructive',
          });
          return prevCart;
        }
        return prevCart.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { medicine, quantity: 1 }];
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.medicine.id !== medicineId)
    );
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.medicine.price * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty cart',
        description: 'Please add items to your cart before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Process payment logic here
      toast({
        title: 'Payment successful',
        description: 'Your order has been processed successfully.',
      });
      
      // Clear cart
      setCart([]);
      setSelectedCustomer(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Add customer logic here
      toast({
        title: 'Customer added',
        description: 'New customer has been added successfully.',
      });
      
      setShowCustomerDialog(false);
      setNewCustomer({ name: '', phone: '', email: '' });
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
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Medicine List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                <SelectItem value="Vitamins">Vitamins</SelectItem>
                <SelectItem value="First Aid">First Aid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredMedicines.map((medicine) => (
                <Card
                  key={medicine.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => addToCart(medicine)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4">
                      {medicine.image ? (
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <Badge
                        className="absolute top-2 right-2"
                        variant={medicine.stock > 10 ? "default" : "destructive"}
                      >
                        {medicine.stock} in stock
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{medicine.name}</h3>
                    <p className="text-sm text-muted-foreground">{medicine.category}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold">${medicine.price.toFixed(2)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(medicine);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.medicine.id}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">{item.medicine.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                ${item.medicine.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(
                                    item.medicine.id,
                                    Math.max(0, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(
                                    item.medicine.id,
                                    Math.min(
                                      item.medicine.stock,
                                      item.quantity + 1
                                    )
                                  )
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.medicine.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%)</span>
                        <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>
                          ${(calculateTotal() * 1.1).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowCustomerDialog(true)}
                          >
                            {selectedCustomer ? (
                              <div className="flex items-center justify-between w-full">
                                <span>{selectedCustomer.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(null);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Select Customer
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Customer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={newCustomer.name}
                                onChange={(e) =>
                                  setNewCustomer({
                                    ...newCustomer,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={newCustomer.phone}
                                onChange={(e) =>
                                  setNewCustomer({
                                    ...newCustomer,
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email (Optional)</Label>
                              <Input
                                id="email"
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) =>
                                  setNewCustomer({
                                    ...newCustomer,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
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
                        </DialogContent>
                      </Dialog>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Print receipt logic
                            toast({
                              title: 'Printing receipt',
                              description: 'Your receipt is being printed.',
                            });
                          }}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <Button
                          className="w-full"
                          onClick={handlePayment}
                          disabled={loading || cart.length === 0}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pay
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}