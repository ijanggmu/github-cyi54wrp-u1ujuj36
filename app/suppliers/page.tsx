'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { SupplierDialog } from '@/components/modals/supplier-dialog';

const fetchSuppliers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      name: 'PharmaCorp Inc.',
      email: 'contact@pharmacorp.com',
      phone: '+1234567890',
      address: '123 Pharma Street, Medical City, MC 12345',
      status: 'active',
    },
    {
      id: '2',
      name: 'MediSupply Co.',
      email: 'info@medisupply.com',
      phone: '+1987654321',
      address: '456 Health Avenue, Wellness Town, WT 67890',
      status: 'active',
    },
  ];
};

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
        <SupplierDialog />
      </div>
      <DataTable columns={columns} data={suppliers} searchKey="name" />
    </div>
  );
}