import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, validateRequiredFields, getPaginationParams } from './utils';

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  payment_terms: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierFormData {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id?: string;
  payment_terms?: string;
  notes?: string;
}

const requiredFields: (keyof SupplierFormData)[] = [
  'name',
  'contact_person',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'postal_code',
  'country',
];

export async function getSuppliers(page = 1, pageSize = 10) {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError(
    async () => {
      const { data, error, count } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      return { 
        data: data || [], 
        error,
        count: count || 0
      };
    },
    'Failed to fetch suppliers'
  );
}

export async function getSupplier(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    'Failed to fetch supplier'
  );
}

export async function createSupplier(supplier: SupplierFormData) {
  const supabase = createClient();
  validateRequiredFields(supplier, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplier])
        .select()
        .single();
      return { data, error };
    },
    'Failed to create supplier'
  );
}

export async function updateSupplier(id: string, updates: Partial<SupplierFormData>) {
  const supabase = createClient();
  validateRequiredFields(updates, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update supplier'
  );
}

export async function deleteSupplier(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      return { data: null, error };
    },
    'Failed to delete supplier'
  );
}

export async function searchSuppliers(query: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .or(`name.ilike.%${query}%,contact_person.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);
      return { data: data || [], error };
    },
    'Failed to search suppliers'
  );
} 