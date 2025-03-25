'use client';

import { useState } from 'react';
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

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: defaultPermissions,
      createdAt: '2024-03-25T10:00:00',
      updatedAt: '2024-03-25T10:00:00',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Manage inventory and sales operations',
      permissions: [
        'View Dashboard',
        'Manage Inventory',
        'Manage Sales',
        'View Analytics',
        'Export Data',
      ],
      createdAt: '2024-03-25T10:00:00',
      updatedAt: '2024-03-25T10:00:00',
    },
    {
      id: '3',
      name: 'User',
      description: 'Basic access for daily operations',
      permissions: [
        'View Dashboard',
        'Manage Inventory',
        'Manage Sales',
      ],
      createdAt: '2024-03-25T10:00:00',
      updatedAt: '2024-03-25T10:00:00',
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newRoleData: Role = {
        id: (roles.length + 1).toString(),
        name: newRole.name!,
        description: newRole.description!,
        permissions: newRole.permissions!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoles([...roles, newRoleData]);
      setIsCreateDialogOpen(false);
      setNewRole({ name: '', description: '', permissions: [] });
      toast({
        title: 'Role created successfully',
        description: 'The new role has been created and added to the system.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create role. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoles(roles.map(role =>
        role.id === selectedRole?.id
          ? { ...role, ...selectedRole, updatedAt: new Date().toISOString() }
          : role
      ));
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      toast({
        title: 'Role updated successfully',
        description: 'The role has been updated with the new information.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update role. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoles(roles.filter(role => role.id !== selectedRole?.id));
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      toast({
        title: 'Role deleted successfully',
        description: 'The role has been removed from the system.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete role. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
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
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Role'
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Permissions</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Last Updated</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredRoles.map((role) => (
                    <tr
                      key={role.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>{role.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{role.description}</td>
                      <td className="p-4 align-middle">
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
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(role.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center space-x-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedRole(role)}
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
                                    value={selectedRole?.name}
                                    onChange={(e) =>
                                      setSelectedRole({ ...selectedRole!, name: e.target.value })
                                    }
                                    placeholder="Enter role name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={selectedRole?.description}
                                    onChange={(e) =>
                                      setSelectedRole({ ...selectedRole!, description: e.target.value })
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
                                            checked={selectedRole?.permissions.includes(permission)}
                                            onCheckedChange={(checked) => {
                                              setSelectedRole({
                                                ...selectedRole!,
                                                permissions: checked
                                                  ? [...selectedRole!.permissions, permission]
                                                  : selectedRole!.permissions.filter(p => p !== permission),
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
                                  onClick={() => setIsEditDialogOpen(false)}
                                  disabled={isLoading}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateRole} disabled={isLoading}>
                                  {isLoading ? (
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

                          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedRole(role)}
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
                                <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteRole}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}