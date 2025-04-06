import { createClient } from '@/lib/supabase/client';

export interface Supplier {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  reorder_level: number;
  supplier_id: string;
  created_at: string;
  updated_at: string;
  suppliers?: Supplier;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      suppliers (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      suppliers (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select(`
      *,
      suppliers (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select(`
      *,
      suppliers (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function updateStock(id: string, quantity: number): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: quantity })
    .eq('id', id)
    .select(`
      *,
      suppliers (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getLowStockProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      suppliers (
        id,
        name
      )
    `)
    .lte('stock_quantity', supabase.rpc('get_reorder_level'))
    .order('stock_quantity', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
} 