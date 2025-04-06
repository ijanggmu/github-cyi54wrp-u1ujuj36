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
  Search,
  Plus,
  Edit2,
  Eye,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { 
  getSuppliers, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier, 
  searchSuppliers,
  Supplier 
} from '@/lib/db/suppliers';
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

interface SupplierFormData {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  payment_terms: string;
  notes: string;
}

export default function SuppliersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<SupplierFormData>({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    tax_id: '',
    payment_terms: '',
    notes: '',
  });

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'contact_person',
      header: 'Contact Person',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'address',
      header: 'Address',
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
              setSelectedSupplier(row.original);
              setShowViewDialog(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedSupplier(row.original);
              setShowEditDialog(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
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
    data: suppliers,
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
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      if (data && data.data) {
        setSuppliers(data.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load suppliers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadSuppliers();
      return;
    }

    setLoading(true);
    try {
      const data = await searchSuppliers(query);
      if (data && data.data) {
        setSuppliers(data.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search suppliers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    setLoading(true);
    try {
      await createSupplier(newSupplier);
      toast({
        title: 'Success',
        description: 'Supplier added successfully.',
      });
      setShowAddDialog(false);
      loadSuppliers();
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
      await updateSupplier(selectedSupplier.id, newSupplier);
      toast({
        title: 'Success',
        description: 'Supplier updated successfully.',
      });
      setShowEditDialog(false);
      loadSuppliers();
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

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return;
    
    setLoading(true);
    try {
      await deleteSupplier(supplierToDelete.id);
      await loadSuppliers();
      toast({
        title: 'Success',
        description: 'Supplier deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete supplier. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setSupplierToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Suppliers</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={newSupplier.contact_person}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, contact_person: e.target.value })
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={newSupplier.city}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, city: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={newSupplier.state}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, state: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={newSupplier.postal_code}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, postal_code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={newSupplier.country}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, country: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                value={newSupplier.tax_id}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, tax_id: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Payment Terms</Label>
              <Input
                id="payment_terms"
                value={newSupplier.payment_terms}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, payment_terms: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newSupplier.notes}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, notes: e.target.value })
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact_person">Contact Person</Label>
              <Input
                id="edit-contact_person"
                value={newSupplier.contact_person}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, contact_person: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={newSupplier.city}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, city: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-state">State</Label>
              <Input
                id="edit-state"
                value={newSupplier.state}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, state: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-postal_code">Postal Code</Label>
              <Input
                id="edit-postal_code"
                value={newSupplier.postal_code}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, postal_code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                value={newSupplier.country}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, country: e.target.value })
                }
              />
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

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
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
                <Label>Contact Person</Label>
                <p>{selectedSupplier.contact_person}</p>
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
              {selectedSupplier.city && (
                <div>
                  <Label>City</Label>
                  <p>{selectedSupplier.city}</p>
                </div>
              )}
              {selectedSupplier.state && (
                <div>
                  <Label>State</Label>
                  <p>{selectedSupplier.state}</p>
                </div>
              )}
              {selectedSupplier.postal_code && (
                <div>
                  <Label>Postal Code</Label>
                  <p>{selectedSupplier.postal_code}</p>
                </div>
              )}
              {selectedSupplier.country && (
                <div>
                  <Label>Country</Label>
                  <p>{selectedSupplier.country}</p>
                </div>
              )}
              {selectedSupplier.tax_id && (
                <div>
                  <Label>Tax ID</Label>
                  <p>{selectedSupplier.tax_id}</p>
                </div>
              )}
              {selectedSupplier.payment_terms && (
                <div>
                  <Label>Payment Terms</Label>
                  <p>{selectedSupplier.payment_terms}</p>
                </div>
              )}
              {selectedSupplier.notes && (
                <div>
                  <Label>Notes</Label>
                  <p>{selectedSupplier.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier
              {supplierToDelete ? ` "${supplierToDelete.name}"` : ''} and all associated data.
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