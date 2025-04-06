'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  History,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { 
  getInventory, 
  updateStock, 
  updateReorderLevel, 
  getLowStockProducts, 
  getStockHistory, 
  addStockHistory,
  InventoryItem,
  Product
} from '@/lib/db/inventory';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  
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

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: 'products.name',
      header: 'Product Name',
    },
    {
      accessorKey: 'products.sku',
      header: 'SKU',
    },
    {
      accessorKey: 'products.category',
      header: 'Category',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'reorder_level',
      header: 'Reorder Level',
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        const reorderLevel = row.original.reorder_level;
        const status = getStockStatus(quantity, reorderLevel);
        return (
          <Badge variant={status.variant as "default" | "destructive" | "secondary" | "outline"}>
            {status.text}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedItem(row.original);
              setShowUpdateDialog(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedItem(row.original);
              setShowHistoryDialog(true);
            }}
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: inventory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
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
      const { data } = await getLowStockProducts();
      if (data) {
        setLowStockItems(data);
      }
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

  const handleUpdateStock = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      await updateStock(selectedItem.id, updateData.quantity);
      await addStockHistory({
        product_id: selectedItem.product_id,
        quantity: updateData.quantity,
        type: updateData.quantity > 0 ? 'in' : 'out',
      });
      toast({
        title: 'Success',
        description: 'Stock updated successfully.',
      });
      setShowUpdateDialog(false);
      loadInventory();
      loadLowStockItems();
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
      toast({
        title: 'Success',
        description: 'Reorder level updated successfully.',
      });
      loadInventory();
      loadLowStockItems();
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
      return { text: 'Out of Stock', variant: 'destructive' as const };
    } else if (quantity <= reorder_level) {
      return { text: 'Low Stock', variant: 'secondary' as const };
    } else {
      return { text: 'In Stock', variant: 'default' as const };
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

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    try {
      await deleteProduct(itemToDelete.id);
      await loadInventory();
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Inventory</CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {/* Add category options here */}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label>Product</Label>
                <p>{selectedItem.products?.name}</p>
              </div>
              <div>
                <Label>Current Stock</Label>
                <p>{selectedItem.quantity}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Change</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={updateData.quantity}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, quantity: Number(e.target.value) })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Enter positive number to add stock, negative to remove
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder_level">Reorder Level</Label>
                <Input
                  id="reorder_level"
                  type="number"
                  value={updateData.reorder_level}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, reorder_level: Number(e.target.value) })
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
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock History</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label>Product</Label>
                <p>{selectedItem.products?.name}</p>
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
                        <TableCell>{new Date(history.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={history.type === 'in' ? 'default' : 'destructive'}>
                            {history.type === 'in' ? 'In' : 'Out'}
                          </Badge>
                        </TableCell>
                        <TableCell>{history.quantity}</TableCell>
                        <TableCell>{history.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              {itemToDelete ? ` "${itemToDelete.name}"` : ''} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}