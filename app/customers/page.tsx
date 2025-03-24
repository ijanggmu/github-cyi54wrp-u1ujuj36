'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { CustomerDialog } from '@/components/modals/customer-dialog';

// Mock API call
const fetchCustomers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      lastVisit: '2024-03-20',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      lastVisit: '2024-03-19',
    },
  ];
};

export default function CustomersPage() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <CustomerDialog />
      </div>
      <DataTable columns={columns} data={customers} searchKey="name" />
    </div>
  );
}