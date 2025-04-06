import { createClient } from '@/lib/supabase/client';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  last_visit?: string;
  total_spent?: number;
}

export async function getCustomers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Customer[];
}

export async function getCustomer(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
}

export async function deleteCustomer(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function searchCustomers(query: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Customer[];
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