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
  Package,
  AlertCircle,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";

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

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        {lowStockMedicines.length > 0 && (
          <Card className="bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
                  <p className="text-sm text-yellow-700">
                    {lowStockMedicines.length} medicines are running low on stock
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
                <AlertCircle className="h-5 w-5 text-red-500" />
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
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader text="Loading inventory..." />
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No medicines found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>{medicine.supplier}</TableCell>
                      <TableCell>${medicine.costPrice.toFixed(2)}</TableCell>
                      <TableCell>${medicine.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={medicine.stock > medicine.minStock ? "default" : "destructive"}
                        >
                          {medicine.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={new Date(medicine.expiryDate) > new Date() ? "default" : "destructive"}
                        >
                          {medicine.expiryDate}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedMedicine(medicine)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Medicine Details</DialogTitle>
                              </DialogHeader>
                              {selectedMedicine && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedMedicine.name}</p>
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <p>{selectedMedicine.category}</p>
                                  </div>
                                  <div>
                                    <Label>Supplier</Label>
                                    <p>{selectedMedicine.supplier}</p>
                                  </div>
                                  <div>
                                    <Label>Cost Price</Label>
                                    <p>${selectedMedicine.costPrice.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label>Selling Price</Label>
                                    <p>${selectedMedicine.sellingPrice.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label>Current Stock</Label>
                                    <p>{selectedMedicine.stock}</p>
                                  </div>
                                  <div>
                                    <Label>Minimum Stock</Label>
                                    <p>{selectedMedicine.minStock}</p>
                                  </div>
                                  <div>
                                    <Label>Expiry Date</Label>
                                    <p>{selectedMedicine.expiryDate}</p>
                                  </div>
                                  {selectedMedicine.description && (
                                    <div>
                                      <Label>Description</Label>
                                      <p>{selectedMedicine.description}</p>
                                    </div>
                                  )}
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
                                  setSelectedMedicine(medicine);
                                  setNewMedicine({
                                    name: medicine.name,
                                    category: medicine.category,
                                    supplier: medicine.supplier,
                                    costPrice: medicine.costPrice,
                                    sellingPrice: medicine.sellingPrice,
                                    stock: medicine.stock,
                                    minStock: medicine.minStock,
                                    expiryDate: medicine.expiryDate,
                                    description: medicine.description || '',
                                  });
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Medicine</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={newMedicine.name}
                                    onChange={(e) =>
                                      setNewMedicine({
                                        ...newMedicine,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-category">Category</Label>
                                  <Select
                                    value={newMedicine.category}
                                    onValueChange={(value) =>
                                      setNewMedicine({
                                        ...newMedicine,
                                        category: value,
                                      })
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
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-supplier">Supplier</Label>
                                  <Select
                                    value={newMedicine.supplier}
                                    onValueChange={(value) =>
                                      setNewMedicine({
                                        ...newMedicine,
                                        supplier: value,
                                      })
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
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-costPrice">Cost Price</Label>
                                  <Input
                                    id="edit-costPrice"
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
                                  <Label htmlFor="edit-sellingPrice">Selling Price</Label>
                                  <Input
                                    id="edit-sellingPrice"
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
                                  <Label htmlFor="edit-stock">Current Stock</Label>
                                  <Input
                                    id="edit-stock"
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
                                  <Label htmlFor="edit-minStock">Minimum Stock</Label>
                                  <Input
                                    id="edit-minStock"
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
                                  <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                                  <Input
                                    id="edit-expiryDate"
                                    type="date"
                                    value={newMedicine.expiryDate}
                                    onChange={(e) =>
                                      setNewMedicine({
                                        ...newMedicine,
                                        expiryDate: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-description">Description (Optional)</Label>
                                  <Input
                                    id="edit-description"
                                    value={newMedicine.description}
                                    onChange={(e) =>
                                      setNewMedicine({
                                        ...newMedicine,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <Button
                                className="w-full mt-4"
                                onClick={handleEditMedicine}
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  'Update Medicine'
                                )}
                              </Button>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMedicine(medicine.id)}
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