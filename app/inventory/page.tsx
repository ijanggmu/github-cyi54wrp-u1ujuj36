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
  AlertTriangle,
  Package,
  ArrowUpDown,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { getInventory, updateStock, updateReorderLevel, getLowStockItems, getStockHistory, addStockHistory } from '@/lib/db/inventory';
import { InventoryItem } from '@/lib/db/inventory';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Medicine {
  id: string;
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  expiryDate: string;
  description?: string;
  image?: string;
}

interface Supplier {
  id: string;
  name: string;
  company: string;
}

export default function InventoryPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [updateData, setUpdateData] = useState({
    quantity: 0,
    reorder_level: 0,
  });
  
  // Sample data - replace with API calls
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Pain Relief', description: 'Pain relief medications' },
    { id: '2', name: 'Antibiotics', description: 'Antibiotic medications' },
    { id: '3', name: 'Vitamins', description: 'Vitamin supplements' },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'John Smith', company: 'PharmaCorp Inc.' },
    { id: '2', name: 'Jane Doe', company: 'MediSupply Co.' },
  ]);

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol',
      category: 'Pain Relief',
      supplier: 'PharmaCorp Inc.',
      costPrice: 3.50,
      sellingPrice: 5.99,
      stock: 100,
      minStock: 20,
      expiryDate: '2025-12-31',
      description: 'Pain relief medication',
      image: '/medicines/paracetamol.jpg',
    },
    // Add more sample medicines...
  ]);

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
    name: '',
    category: '',
    supplier: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    expiryDate: '',
    description: '',
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    company: '',
  });

  useEffect(() => {
    loadInventory();
    loadLowStockItems();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load inventory. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLowStockItems = async () => {
    try {
      const data = await getLowStockItems();
      setLowStockItems(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load low stock items. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const loadStockHistory = async (product_id: string) => {
    try {
      const data = await getStockHistory(product_id);
      setStockHistory(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load stock history. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.products?.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.products?.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateStock = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      await updateStock(selectedItem.id, updateData.quantity);
      await addStockHistory({
        product_id: selectedItem.product_id,
        quantity: updateData.quantity,
        type: updateData.quantity > selectedItem.quantity ? 'in' : 'out',
        notes: `Stock updated from ${selectedItem.quantity} to ${updateData.quantity}`,
      });
      await loadInventory();
      setShowUpdateDialog(false);
      
      toast({
        title: 'Stock updated',
        description: 'Inventory stock has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReorderLevel = async (id: string, reorder_level: number) => {
    setLoading(true);
    try {
      await updateReorderLevel(id, reorder_level);
      await loadInventory();
      
      toast({
        title: 'Reorder level updated',
        description: 'Reorder level has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reorder level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number, reorder_level: number) => {
    if (quantity <= 0) {
      return { text: 'Out of Stock', color: 'text-red-500' };
    } else if (quantity <= reorder_level) {
      return { text: 'Low Stock', color: 'text-yellow-500' };
    } else {
      return { text: 'In Stock', color: 'text-green-500' };
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: 'Missing information',
        description: 'Please fill in the category name.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const category: Category = {
        id: `${categories.length + 1}`,
        ...newCategory,
      };
      
      setCategories([...categories, category]);
      setShowCategoryDialog(false);
      setNewCategory({ name: '', description: '' });
      
      toast({
        title: 'Category added',
        description: 'New category has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.company) {
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
      };
      
      setSuppliers([...suppliers, supplier]);
      setShowSupplierDialog(false);
      setNewSupplier({ name: '', company: '' });
      
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

  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.category || !newMedicine.supplier || 
        !newMedicine.costPrice || !newMedicine.sellingPrice || !newMedicine.stock || 
        !newMedicine.minStock || !newMedicine.expiryDate) {
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
      
      const medicine: Medicine = {
        id: `${medicines.length + 1}`,
        ...newMedicine,
      };
      
      setMedicines([...medicines, medicine]);
      setShowAddDialog(false);
      setNewMedicine({
        name: '',
        category: '',
        supplier: '',
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 0,
        expiryDate: '',
        description: '',
      });
      
      toast({
        title: 'Medicine added',
        description: 'New medicine has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add medicine. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedicine = async () => {
    if (!selectedMedicine) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMedicines(medicines.map(medicine =>
        medicine.id === selectedMedicine.id
          ? { ...medicine, ...newMedicine }
          : medicine
      ));
      
      setShowEditDialog(false);
      setSelectedMedicine(null);
      setNewMedicine({
        name: '',
        category: '',
        supplier: '',
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 0,
        expiryDate: '',
        description: '',
      });
      
      toast({
        title: 'Medicine updated',
        description: 'Medicine information has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update medicine. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMedicines(medicines.filter(medicine => medicine.id !== id));
      
      toast({
        title: 'Medicine deleted',
        description: 'Medicine has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete medicine. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const lowStockMedicines = medicines.filter(medicine => medicine.stock <= medicine.minStock);
  const expiredMedicines = medicines.filter(medicine => new Date(medicine.expiryDate) < new Date());

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy inventory
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Select
                    value={newMedicine.category}
                    onValueChange={(value) =>
                      setNewMedicine({ ...newMedicine, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCategoryDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <div className="flex gap-2">
                  <Select
                    value={newMedicine.supplier}
                    onValueChange={(value) =>
                      setNewMedicine({ ...newMedicine, supplier: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.company}>
                          {supplier.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSupplierDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={newMedicine.costPrice}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      costPrice: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  value={newMedicine.sellingPrice}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      sellingPrice: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newMedicine.stock}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      stock: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newMedicine.minStock}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      minStock: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newMedicine.expiryDate}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, expiryDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newMedicine.description}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, description: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleAddMedicine}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Medicine'
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {lowStockItems.length > 0 && (
          <Card className="bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
                  <p className="text-sm text-yellow-700">
                    {lowStockItems.length} medicines are running low on stock
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {expiredMedicines.length > 0 && (
          <Card className="bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Expired Medicines</h3>
                  <p className="text-sm text-red-700">
                    {expiredMedicines.length} medicines have expired
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader text="Loading inventory..." />
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No inventory items found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item.quantity, item.reorder_level);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.products?.name}</TableCell>
                        <TableCell>{item.products?.sku}</TableCell>
                        <TableCell>{item.products?.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.reorder_level}
                            onChange={(e) =>
                              handleUpdateReorderLevel(item.id, parseInt(e.target.value))
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <span className={status.color}>{status.text}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setUpdateData({
                                      quantity: item.quantity,
                                      reorder_level: item.reorder_level,
                                    });
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Stock</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Product</Label>
                                    <p className="font-medium">{item.products?.name}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="quantity">New Quantity</Label>
                                    <Input
                                      id="quantity"
                                      type="number"
                                      value={updateData.quantity}
                                      onChange={(e) =>
                                        setUpdateData({
                                          ...updateData,
                                          quantity: parseInt(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                  <Button
                                    className="w-full"
                                    onClick={handleUpdateStock}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                      </>
                                    ) : (
                                      'Update Stock'
                                    )}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    loadStockHistory(item.product_id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Stock History</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Product</Label>
                                    <p className="font-medium">{item.products?.name}</p>
                                  </div>
                                  <div className="rounded-md border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Date</TableHead>
                                          <TableHead>Type</TableHead>
                                          <TableHead>Quantity</TableHead>
                                          <TableHead>Notes</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {stockHistory.map((history) => (
                                          <TableRow key={history.id}>
                                            <TableCell>
                                              {new Date(history.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                              <span
                                                className={
                                                  history.type === 'in'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                                }
                                              >
                                                {history.type === 'in' ? 'In' : 'Out'}
                                              </span>
                                            </TableCell>
                                            <TableCell>{history.quantity}</TableCell>
                                            <TableCell>{history.notes}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Input
                id="category-description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAddCategory}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Category'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Supplier Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Contact Name</Label>
              <Input
                id="supplier-name"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier-company">Company Name</Label>
              <Input
                id="supplier-company"
                value={newSupplier.company}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, company: e.target.value })
                }
              />
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
  );
}