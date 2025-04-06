import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export async function handleSupabaseError<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await operation();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    toast.error(error instanceof Error ? error.message : errorMessage);
    return { data: null, error: error instanceof Error ? error.message : errorMessage };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getPaginationParams(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field] && data[field] !== 0) {
      return `Field ${String(field)} is required`;
    }
  }
  return null;
} 