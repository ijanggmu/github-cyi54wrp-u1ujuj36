'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Medicine = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
  supplier: string;
};

export const columns: ColumnDef<Medicine>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      return (
        <div className={`${stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
          {stock}
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return `$${price.toFixed(2)}`;
    },
  },
  {
    accessorKey: 'expiryDate',
    header: 'Expiry Date',
  },
  {
    accessorKey: 'supplier',
    header: 'Supplier',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const medicine = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(medicine.id)}
            >
              Copy medicine ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit medicine</DropdownMenuItem>
            <DropdownMenuItem>Update stock</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete medicine
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];