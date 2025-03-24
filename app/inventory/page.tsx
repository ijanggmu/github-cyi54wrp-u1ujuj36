'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { MedicineDialog } from '@/components/modals/medicine-dialog';

const fetchMedicines = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      stock: 150,
      price: 9.99,
      expiryDate: '2025-03-20',
      supplier: 'PharmaCorp Inc.',
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 15,
      price: 19.99,
      expiryDate: '2024-06-15',
      supplier: 'MediSupply Co.',
    },
  ];
};

export default function InventoryPage() {
  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: fetchMedicines,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <MedicineDialog />
      </div>
      <DataTable columns={columns} data={medicines} searchKey="name" />
    </div>
  );
}