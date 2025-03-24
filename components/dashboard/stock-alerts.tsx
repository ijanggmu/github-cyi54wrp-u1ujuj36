'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const alerts = [
  {
    id: '1',
    title: 'Paracetamol 500mg',
    description: 'Stock level: 15 units (below minimum threshold)',
  },
  {
    id: '2',
    title: 'Amoxicillin 250mg',
    description: 'Expires in 30 days',
  },
  {
    id: '3',
    title: 'Ibuprofen 400mg',
    description: 'Stock level: 20 units (below minimum threshold)',
  },
];

export function StockAlerts() {
  return (
    <div className="mt-4 space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}