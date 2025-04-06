import { createClient } from '@/lib/supabase/client';

export interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  reorder_level: number;
  last_restocked: string;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    category: string;
  };
}

export async function getInventory() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products (
        id,
        name,
        sku,
        price,
        category
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as InventoryItem[];
}

export async function getInventoryItem(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products (
        id,
        name,
        sku,
        price,
        category
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryItem;
}

export async function updateStock(id: string, quantity: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .update({ quantity })
    .eq('id', id)
    .select(`
      *,
      products (
        id,
        name,
        sku,
        price,
        category
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryItem;
}

export async function updateReorderLevel(id: string, reorder_level: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .update({ reorder_level })
    .eq('id', id)
    .select(`
      *,
      products (
        id,
        name,
        sku,
        price,
        category
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryItem;
}

export async function getLowStockItems() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products (
        id,
        name,
        sku,
        price,
        category
      )
    `)
    .lte('quantity', supabase.rpc('get_reorder_level'))
    .order('quantity', { ascending: true });

  if (error) {
    throw error;
  }

  return data as InventoryItem[];
}

export async function getStockHistory(product_id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stock_history')
    .select('*')
    .eq('product_id', product_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function addStockHistory(history: {
  product_id: string;
  quantity: number;
  type: 'in' | 'out';
  notes?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stock_history')
    .insert([history])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
} 