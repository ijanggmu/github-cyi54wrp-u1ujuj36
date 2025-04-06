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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Edit2,
  Eye,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { 
  getCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  searchCustomers,
  Customer 
} from '@/lib/db/customers';

export default function CustomersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      debugger;
      setCustomers(data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load customers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadCustomers();
      return;
    }

    setLoading(true);
    try {
      const data = await searchCustomers(query);
      setCustomers(data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search customers. Please try again.',
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
      await createCustomer(newCustomer);
      await loadCustomers();
      setShowAddDialog(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      
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

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;

    setLoading(true);
    try {
      await updateCustomer(selectedCustomer.id, newCustomer);
      await loadCustomers();
      setShowEditDialog(false);
      setSelectedCustomer(null);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      
      toast({
        title: 'Customer updated',
        description: 'Customer information has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    setLoading(true);
    try {
      await deleteCustomer(id);
      await loadCustomers();
      
      toast({
        title: 'Customer deleted',
        description: 'Customer has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy customers
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
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
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
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
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader text="Loading customers..." />
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No customers found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div>
                          <p>{customer.phone}</p>
                          {customer.email && (
                            <p className="text-sm text-muted-foreground">
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{customer.createdAt}</TableCell>
                      <TableCell>{customer.lastVisit}</TableCell>
                      <TableCell>${customer.totalSpent?.toFixed(2)??'0.00'??'0.00'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Customer Details</DialogTitle>
                              </DialogHeader>
                              {selectedCustomer && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedCustomer.name}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedCustomer.phone}</p>
                                  </div>
                                  {selectedCustomer.email && (
                                    <div>
                                      <Label>Email</Label>
                                      <p>{selectedCustomer.email}</p>
                                    </div>
                                  )}
                                  {selectedCustomer.address && (
                                    <div>
                                      <Label>Address</Label>
                                      <p>{selectedCustomer.address}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label>Created</Label>
                                    <p>{selectedCustomer.createdAt}</p>
                                  </div>
                                  <div>
                                    <Label>Last Visit</Label>
                                    <p>{selectedCustomer.lastVisit}</p>
                                  </div>
                                  <div>
                                    <Label>Total Spent</Label>
                                    <p>${selectedCustomer.totalSpent?.toFixed(2)??'0.00'}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setNewCustomer({
                                    name: customer.name,
                                    phone: customer.phone,
                                    email: customer.email || '',
                                    address: customer.address || '',
                                  });
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Customer</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
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
                                  <Label htmlFor="edit-phone">Phone</Label>
                                  <Input
                                    id="edit-phone"
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
                                  <Label htmlFor="edit-email">Email (Optional)</Label>
                                  <Input
                                    id="edit-email"
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
                                <div className="space-y-2">
                                  <Label htmlFor="edit-address">Address (Optional)</Label>
                                  <Input
                                    id="edit-address"
                                    value={newCustomer.address}
                                    onChange={(e) =>
                                      setNewCustomer({
                                        ...newCustomer,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={handleEditCustomer}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    'Update Customer'
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomer(customer.id)}
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