import { createClient } from '@/lib/supabase/client';

export interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  total: number;
  discount: number;
}

export interface Sale {
  id: string;
  customer_id: string | null;
  customer?: {
    name: string;
  };
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export async function getProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getCustomers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createSale(sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sales')
    .insert([sale])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createSaleItems(items: Omit<SaleItem, 'id' | 'created_at'>[]) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sale_items')
    .insert(items)
    .select();

  if (error) throw error;
  return data;
}

export async function updateInventory(productId: string, quantity: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .update({ quantity })
    .eq('product_id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProductStock(productId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('product_id', productId)
    .single();

  if (error) throw error;
  return data?.quantity || 0;
}

export async function getRecentSales(limit = 5) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      customer:customers(name),
      items:sale_items(
        *,
        product:products(name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getSaleById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      customer:customers(name),
      items:sale_items(
        *,
        product:products(name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
} 