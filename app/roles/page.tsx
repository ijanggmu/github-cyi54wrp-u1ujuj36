'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Search, Shield, Trash2, Edit2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader } from '@/components/ui/loader';
import { getRoles, createRole, updateRole, deleteRole, getPermissions, Role } from '@/lib/db/users';

const defaultPermissions = [
  'View Dashboard',
  'Manage Users',
  'Manage Roles',
  'Manage Inventory',
  'Manage Sales',
  'Manage Reports',
  'Manage Settings',
  'View Analytics',
  'Export Data',
  'Manage Notifications',
];

export default function RolesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load roles and permissions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    setLoading(true);
    try {
      await createRole(newRole);
      await loadData();
      setShowAddDialog(false);
      setNewRole({
        name: '',
        description: '',
        permissions: [],
      });
      
      toast({
        title: 'Role added',
        description: 'New role has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;

    setLoading(true);
    try {
      await updateRole(selectedRole.id, {
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
      });
      await loadData();
      setShowEditDialog(false);
      
      toast({
        title: 'Role updated',
        description: 'Role has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    setLoading(true);
    try {
      await deleteRole(id);
      await loadData();
      
      toast({
        title: 'Role deleted',
        description: 'Role has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permission: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  if (loading) {
    return <Loader text="Loading roles..." />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Add a new role to the system with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-2">
                    {defaultPermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={newRole.permissions?.includes(permission)}
                          onCheckedChange={(checked) => {
                            setNewRole({
                              ...newRole,
                              permissions: checked
                                ? [...(newRole.permissions || []), permission]
                                : (newRole.permissions || []).filter(p => p !== permission),
                            });
                          }}
                        />
                        <Label htmlFor={permission}>{permission}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRole} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Role'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <Table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium">Name</TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium">Description</TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium">Permissions</TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium">Created At</TableHead>
                    <TableHead className="h-12 px-4 text-left align-middle font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="p-4 align-middle font-medium">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-middle">{role.description}</TableCell>
                      <TableCell className="p-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        {new Date(role.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        <div className="flex items-center space-x-2">
                          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedRole(role);
                                  setNewRole({
                                    name: role.name,
                                    description: role.description,
                                    permissions: role.permissions,
                                  });
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Role</DialogTitle>
                                <DialogDescription>
                                  Update role information and permissions.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Role Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={newRole.name}
                                    onChange={(e) =>
                                      setNewRole({
                                        ...newRole,
                                        name: e.target.value,
                                      })
                                    }
                                    placeholder="Enter role name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={newRole.description}
                                    onChange={(e) =>
                                      setNewRole({
                                        ...newRole,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Enter role description"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Permissions</Label>
                                  <ScrollArea className="h-[200px] rounded-md border p-4">
                                    <div className="space-y-2">
                                      {defaultPermissions.map((permission) => (
                                        <div key={permission} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`edit-${permission}`}
                                            checked={newRole.permissions.includes(permission)}
                                            onCheckedChange={(checked) => {
                                              setNewRole({
                                                ...newRole,
                                                permissions: checked
                                                  ? [...newRole.permissions, permission]
                                                  : newRole.permissions.filter(p => p !== permission),
                                              });
                                            }}
                                          />
                                          <Label htmlFor={`edit-${permission}`}>{permission}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowEditDialog(false)}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleEditRole} disabled={loading}>
                                  {loading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    'Update Role'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRole(role.id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this role? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    'Delete Role'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}