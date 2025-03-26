'use client';

import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Edit2,
  Eye,
  Trash2,
  Loader2,
  Building2,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";

interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  address?: string;
  contactPerson: string;
  status: 'active' | 'inactive';
  lastOrder: string;
  totalOrders: number;
}

export default function SuppliersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'John Smith',
      company: 'PharmaCorp Inc.',
      phone: '+1 234 567 8900',
      email: 'john@pharmacorp.com',
      address: '123 Business Ave, City',
      contactPerson: 'John Smith',
      status: 'active',
      lastOrder: '2024-03-15',
      totalOrders: 25,
    },
    // Add more sample suppliers...
  ]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id' | 'lastOrder' | 'totalOrders'>>({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
      status: 'active',
  });

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.phone.includes(searchQuery) ||
    supplier.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.company || !newSupplier.phone) {
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
      
      const supplier: Supplier = {
        id: `${suppliers.length + 1}`,
        ...newSupplier,
        lastOrder: new Date().toISOString().split('T')[0],
        totalOrders: 0,
      };
      
      setSuppliers([...suppliers, supplier]);
      setShowAddDialog(false);
      setNewSupplier({
        name: '',
        company: '',
        phone: '',
        email: '',
        address: '',
        contactPerson: '',
        status: 'active',
      });
      
      toast({
        title: 'Supplier added',
        description: 'New supplier has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add supplier. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuppliers(suppliers.map(supplier =>
        supplier.id === selectedSupplier.id
          ? { ...supplier, ...newSupplier }
          : supplier
      ));
      
      setShowEditDialog(false);
      setSelectedSupplier(null);
      setNewSupplier({
        name: '',
        company: '',
        phone: '',
        email: '',
        address: '',
        contactPerson: '',
        status: 'active',
      });
      
      toast({
        title: 'Supplier updated',
        description: 'Supplier information has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update supplier. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      
      toast({
        title: 'Supplier deleted',
        description: 'Supplier has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete supplier. Please try again.',
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
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy suppliers
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name</Label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={newSupplier.company}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, company: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={newSupplier.contactPerson}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, contactPerson: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newSupplier.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setNewSupplier({ ...newSupplier, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleAddSupplier}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Supplier'
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
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader text="Loading suppliers..." />
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No suppliers found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.company}</TableCell>
                      <TableCell>
                        <div>
                          <p>{supplier.phone}</p>
                          {supplier.email && (
                            <p className="text-sm text-muted-foreground">
                              {supplier.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={supplier.status === 'active' ? 'default' : 'secondary'}
                        >
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.lastOrder}</TableCell>
                      <TableCell>{supplier.totalOrders}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedSupplier(supplier)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Supplier Details</DialogTitle>
                              </DialogHeader>
                              {selectedSupplier && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedSupplier.name}</p>
                                  </div>
                                  <div>
                                    <Label>Company</Label>
                                    <p>{selectedSupplier.company}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedSupplier.phone}</p>
                                  </div>
                                  {selectedSupplier.email && (
                                    <div>
                                      <Label>Email</Label>
                                      <p>{selectedSupplier.email}</p>
                                    </div>
                                  )}
                                  {selectedSupplier.address && (
                                    <div>
                                      <Label>Address</Label>
                                      <p>{selectedSupplier.address}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label>Contact Person</Label>
                                    <p>{selectedSupplier.contactPerson}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <Badge
                                      variant={selectedSupplier.status === 'active' ? 'default' : 'secondary'}
                                    >
                                      {selectedSupplier.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Last Order</Label>
                                    <p>{selectedSupplier.lastOrder}</p>
                                  </div>
                                  <div>
                                    <Label>Total Orders</Label>
                                    <p>{selectedSupplier.totalOrders}</p>
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
                                  setSelectedSupplier(supplier);
                                  setNewSupplier({
                                    name: supplier.name,
                                    company: supplier.company,
                                    phone: supplier.phone,
                                    email: supplier.email || '',
                                    address: supplier.address || '',
                                    contactPerson: supplier.contactPerson,
                                    status: supplier.status,
                                  });
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Supplier</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Contact Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={newSupplier.name}
                                    onChange={(e) =>
                                      setNewSupplier({
                                        ...newSupplier,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-company">Company Name</Label>
                                  <Input
                                    id="edit-company"
                                    value={newSupplier.company}
                                    onChange={(e) =>
                                      setNewSupplier({
                                        ...newSupplier,
                                        company: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-phone">Phone</Label>
                                  <Input
                                    id="edit-phone"
                                    value={newSupplier.phone}
                                    onChange={(e) =>
                                      setNewSupplier({
                                        ...newSupplier,
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
                                    value={newSupplier.email}
                                    onChange={(e) =>
                                      setNewSupplier({
                                        ...newSupplier,
                                        email: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-address">Address (Optional)</Label>
                                  <Input
                                    id="edit-address"
                                    value={newSupplier.address}
                                    onChange={(e) =>
                                      setNewSupplier({
                                        ...newSupplier,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-contactPerson">Contact Person</Label>
                                  <Input
                                    id="edit-contactPerson"
                                    value={newSupplier.contactPerson}
                                    onChange={(e) =>
                                      setNewSupplier({
                                        ...newSupplier,
                                        contactPerson: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select
                                    value={newSupplier.status}
                                    onValueChange={(value: 'active' | 'inactive') =>
                                      setNewSupplier({ ...newSupplier, status: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={handleEditSupplier}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    'Update Supplier'
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSupplier(supplier.id)}
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