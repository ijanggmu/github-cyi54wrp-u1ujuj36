"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  Plus,
  Trash2,
  Receipt,
  CreditCard,
  Wallet,
  QrCode,
  Printer,
  History,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function SalesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      price: 5.99,
      stock: 100,
      category: "Pain Relief",
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      price: 12.99,
      stock: 50,
      category: "Antibiotics",
    },
    {
      id: "3",
      name: "Vitamin C 1000mg",
      price: 15.99,
      stock: 75,
      category: "Vitamins",
    },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Error",
          description: "Not enough stock available",
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
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
          total: product.price,
        },
      ]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;

    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: "Error",
        description: "Not enough stock available",
        variant: "destructive",
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              total: quantity * item.price,
            }
          : item
      )
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Success",
        description: "Sale completed successfully",
      });
      setCart([]);
      setPaymentMethod("");
      setShowPaymentDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete sale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <Badge
                            variant={product.stock < 10 ? "destructive" : "default"}
                          >
                            Stock: {product.stock}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-medium">${product.price.toFixed(2)}</p>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {cart.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No items in cart
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-16"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {cart.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Checkout
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Payment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <Select
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">
                                <div className="flex items-center">
                                  <Wallet className="mr-2 h-4 w-4" />
                                  Cash
                                </div>
                              </SelectItem>
                              <SelectItem value="card">
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Card
                                </div>
                              </SelectItem>
                              <SelectItem value="qr">
                                <div className="flex items-center">
                                  <QrCode className="mr-2 h-4 w-4" />
                                  QR Code
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Amount:</span>
                          <span className="text-lg font-bold">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleCheckout}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Receipt className="mr-2 h-4 w-4" />
                              Complete Sale
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {[
                    {
                      id: "1",
                      amount: 25.98,
                      items: 2,
                      time: "5 minutes ago",
                    },
                    {
                      id: "2",
                      amount: 45.99,
                      items: 3,
                      time: "15 minutes ago",
                    },
                    {
                      id: "3",
                      amount: 12.99,
                      items: 1,
                      time: "30 minutes ago",
                    },
                  ].map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">${sale.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {sale.items} items
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {sale.time}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 