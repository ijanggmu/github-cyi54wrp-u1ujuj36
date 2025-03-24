'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const transactions = [
  {
    id: '1',
    customer: 'John Doe',
    amount: '$125.00',
    status: 'Completed',
    date: '2024-03-20',
  },
  {
    id: '2',
    customer: 'Jane Smith',
    amount: '$75.50',
    status: 'Completed',
    date: '2024-03-20',
  },
  {
    id: '3',
    customer: 'Bob Johnson',
    amount: '$250.00',
    status: 'Pending',
    date: '2024-03-19',
  },
  {
    id: '4',
    customer: 'Alice Brown',
    amount: '$180.25',
    status: 'Completed',
    date: '2024-03-19',
  },
];

export function RecentTransactions() {
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.customer}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}