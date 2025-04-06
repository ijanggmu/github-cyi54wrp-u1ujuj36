import { createClient } from '@/lib/supabase/client';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getSupplier(id: string): Promise<Supplier | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .update(supplier)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSupplier(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
} 