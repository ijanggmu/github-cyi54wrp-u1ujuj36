'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Receipt,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: medicines = [] } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          price: 9.99,
          stock: 150,
          category: 'Pain Relief',
        },
        {
          id: '2',
          name: 'Amoxicillin 250mg',
          price: 19.99,
          stock: 15,
          category: 'Antibiotics',
        },
        {
          id: '3',
          name: 'Ibuprofen 400mg',
          price: 12.99,
          stock: 85,
          category: 'Pain Relief',
        },
        {
          id: '4',
          name: 'Omeprazole 20mg',
          price: 24.99,
          stock: 45,
          category: 'Digestive Health',
        },
      ];
    },
  });

  const addToCart = (medicine: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + tax;

  const filteredMedicines = medicines.filter((medicine: any) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMedicines.map((medicine: any) => (
              <Card
                key={medicine.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(medicine)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{medicine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {medicine.category}
                    </p>
                  </div>
                  <Badge
                    variant={medicine.stock > 20 ? 'default' : 'destructive'}
                    className="ml-2"
                  >
                    Stock: {medicine.stock}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold">${medicine.price}</span>
                  <Button size="sm" variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Section */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Cart</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-24rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="outline" className="w-full">
              <Receipt className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}