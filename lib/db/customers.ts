import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, validateRequiredFields, getPaginationParams } from './utils';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  medical_history: string;
  allergies: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  medical_history: string;
  allergies: string;
  notes: string;
}

const requiredFields: (keyof CustomerFormData)[] = [
  'name',
  'email',
  'phone',
  'address',
  'date_of_birth',
  'gender',
];

export async function getCustomers(page = 1, pageSize = 10) {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError(
    async () => {
      const { data, error, count } = await supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      return { 
        data: data || [], 
        error,
        count: count || 0
      };
    },
    'Failed to fetch customers'
  );
}

export async function getCustomer(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    'Failed to fetch customer'
  );
}

export async function createCustomer(customer: CustomerFormData) {
  const supabase = createClient();
  validateRequiredFields(customer, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      return { data, error };
    },
    'Failed to create customer'
  );
}

export async function updateCustomer(id: string, updates: Partial<CustomerFormData>) {
  const supabase = createClient();
  validateRequiredFields(updates, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update customer'
  );
}

export async function deleteCustomer(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      return { data: null, error };
    },
    'Failed to delete customer'
  );
}

export async function searchCustomers(query: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(10);
      return { data: data || [], error };
    },
    'Failed to search customers'
  );
}

export async function updateCustomerLastVisit(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .update({ last_visit: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
}

export async function updateCustomerTotalSpent(id: string, amount: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .update({ total_spent: amount })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
} 