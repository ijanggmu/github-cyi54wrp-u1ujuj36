'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

const allPermissions = [
  {
    id: 'manage_users',
    label: 'Manage Users',
    description: 'Create, edit, and delete user accounts',
  },
  {
    id: 'manage_roles',
    label: 'Manage Roles',
    description: 'Create and modify user roles and permissions',
  },
  {
    id: 'manage_inventory',
    label: 'Manage Inventory',
    description: 'Add, edit, and remove inventory items',
  },
  {
    id: 'manage_sales',
    label: 'Manage Sales',
    description: 'Process sales and view sales history',
  },
  {
    id: 'view_reports',
    label: 'View Reports',
    description: 'Access and download system reports',
  },
  {
    id: 'manage_suppliers',
    label: 'Manage Suppliers',
    description: 'Add and edit supplier information',
  },
  {
    id: 'manage_customers',
    label: 'Manage Customers',
    description: 'Add and edit customer information',
  },
  {
    id: 'manage_settings',
    label: 'Manage Settings',
    description: 'Modify system settings and configurations',
  },
];

export default function RolesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => [
      {
        id: '1',
        name: 'Admin',
        description: 'Full system access with all privileges',
        permissions: allPermissions.map((p) => p.id),
      },
      {
        id: '2',
        name: 'Manager',
        description: 'Operational management with limited administrative access',
        permissions: ['manage_inventory', 'manage_sales', 'view_reports'],
      },
      {
        id: '3',
        name: 'User',
        description: 'Basic system access for daily operations',
        permissions: ['manage_sales', 'view_reports'],
      },
    ],
  });

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call
    console.log('New role:', newRole);
    toast({
      title: 'Role created',
      description: 'The new role has been created successfully.',
    });
    setIsDialogOpen(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  return (
    <div className="h-[calc(100vh-12rem)] p-8 space-y-8 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole({ ...newRole, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newRole.description}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <ScrollArea className="h-[300px] border rounded-md p-4">
                    <div className="space-y-4">
                      {allPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission.id)
                            }
                          />
                          <div>
                            <Label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Role</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{role.name}</CardTitle>
              <Shield className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {role.description}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Permissions:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => {
                    const permInfo = allPermissions.find((p) => p.id === permission);
                    return (
                      <Badge key={permission} variant="secondary">
                        {permInfo?.label || permission}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button variant="ghost" size="icon">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}