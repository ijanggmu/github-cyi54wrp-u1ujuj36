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
  PaginationState,
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
  getCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  searchCustomers,
  Customer,
  CustomerFormData
} from '@/lib/db/customers';
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

interface ApiResponse<T> {
  data: T[] | null;
  error: any;
  count?: number;
}

export default function CustomersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    medical_history: '',
    allergies: '',
    notes: '',
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="w-[150px]">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div className="w-[120px]">{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="w-[200px]">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => <div className="w-[200px]">{row.getValue('address')}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2 w-[100px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCustomer(row.original);
              setShowViewDialog(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCustomer(row.original);
              setShowEditDialog(true);
              setNewCustomer({
                name: row.original.name,
                email: row.original.email,
                phone: row.original.phone,
                address: row.original.address,
                date_of_birth: row.original.date_of_birth,
                gender: row.original.gender,
                medical_history: row.original.medical_history || '',
                allergies: row.original.allergies || '',
                notes: row.original.notes || '',
              });
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

  const pagination = {
    pageIndex,
    pageSize,
  };

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery,
      pagination,
    },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCustomers / pageSize),
    manualPagination: true,
  });

  useEffect(() => {
    loadCustomers();
  }, [pageIndex, pageSize]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers(pageIndex + 1, pageSize) as ApiResponse<Customer>;
      if (response && !response.error) {
        setCustomers(response.data || []);
        setTotalCustomers(response.count || 0);
      }
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
      const response = await searchCustomers(query) as ApiResponse<Customer>;
      if (response && !response.error) {
        setCustomers(response.data || []);
        setTotalCustomers(response.data?.length || 0);
      }
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
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.email || !newCustomer.date_of_birth || !newCustomer.gender) {
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
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        date_of_birth: '',
        gender: '',
        medical_history: '',
        allergies: '',
        notes: '',
      });
      
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
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        date_of_birth: '',
        gender: '',
        medical_history: '',
        allergies: '',
        notes: '',
      });
      
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

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    
    setLoading(true);
    try {
      await deleteCustomer(customerToDelete.id);
      await loadCustomers();
      toast({
        title: 'Success',
        description: 'Customer deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all your customers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="relative overflow-auto" style={{ height: 'calc(100vh - 300px)' }}>
            <Table>
              <TableHeader className="bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id}
                        style={{ 
                          position: 'sticky', 
                          top: 0, 
                          backgroundColor: 'white', 
                          zIndex: 1,
                          width: header.getSize()
                        }}
                      >
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                        >
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
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {pageIndex * pageSize + 1} to{' '}
            {Math.min((pageIndex + 1) * pageSize, totalCustomers)} of{' '}
            {totalCustomers} entries
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                  setPagination({ pageIndex: 0, pageSize: Number(e.target.value) });
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.setPageIndex(0);
                  setPagination({ pageIndex: 0, pageSize });
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.previousPage();
                  setPagination({ pageIndex: pageIndex - 1, pageSize });
                }}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.nextPage();
                  setPagination({ pageIndex: pageIndex + 1, pageSize });
                }}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const lastPage = table.getPageCount() - 1;
                  table.setPageIndex(lastPage);
                  setPagination({ pageIndex: lastPage, pageSize });
                }}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={newCustomer.date_of_birth}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, date_of_birth: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                value={newCustomer.gender}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, gender: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medical_history">Medical History</Label>
              <Input
                id="medical_history"
                value={newCustomer.medical_history}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, medical_history: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={newCustomer.allergies}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, allergies: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newCustomer.notes}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, notes: e.target.value })
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCustomer(selectedCustomer);
              setNewCustomer({
                name: selectedCustomer?.name || '',
                email: selectedCustomer?.email || '',
                phone: selectedCustomer?.phone || '',
                address: selectedCustomer?.address || '',
                date_of_birth: selectedCustomer?.date_of_birth || '',
                gender: selectedCustomer?.gender || '',
                medical_history: selectedCustomer?.medical_history || '',
                allergies: selectedCustomer?.allergies || '',
                notes: selectedCustomer?.notes || '',
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
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date_of_birth">Date of Birth *</Label>
              <Input
                id="edit-date_of_birth"
                type="date"
                value={newCustomer.date_of_birth}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, date_of_birth: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-gender">Gender *</Label>
              <select
                id="edit-gender"
                value={newCustomer.gender}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, gender: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-medical_history">Medical History</Label>
              <Input
                id="edit-medical_history"
                value={newCustomer.medical_history}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, medical_history: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-allergies">Allergies</Label>
              <Input
                id="edit-allergies"
                value={newCustomer.allergies}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, allergies: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={newCustomer.notes}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, notes: e.target.value })
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

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
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
              <div>
                <Label>Email</Label>
                <p>{selectedCustomer.email}</p>
              </div>
              <div>
                <Label>Address</Label>
                <p>{selectedCustomer.address}</p>
              </div>
              <div>
                <Label>Gender</Label>
                <p>{selectedCustomer.gender}</p>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <p>{selectedCustomer.date_of_birth}</p>
              </div>
              {selectedCustomer.medical_history && (
                <div>
                  <Label>Medical History</Label>
                  <p>{selectedCustomer.medical_history}</p>
                </div>
              )}
              {selectedCustomer.allergies && (
                <div>
                  <Label>Allergies</Label>
                  <p>{selectedCustomer.allergies}</p>
                </div>
              )}
              {selectedCustomer.notes && (
                <div>
                  <Label>Notes</Label>
                  <p>{selectedCustomer.notes}</p>
                </div>
              )}
              <div>
                <Label>Created</Label>
                <p>{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p>{new Date(selectedCustomer.updated_at).toLocaleDateString()}</p>
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
              This action cannot be undone. This will permanently delete the customer
              {customerToDelete ? ` "${customerToDelete.name}"` : ''} and all associated data.
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