import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, validateRequiredFields, getPaginationParams } from './utils';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category_id: string;
  supplier_id: string;
  unit_price: number;
  selling_price: number;
  quantity_in_stock: number;
  reorder_level: number;
  expiry_date?: string;
  batch_number?: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category_id: string;
  supplier_id: string;
  unit_price: number;
  selling_price: number;
  quantity_in_stock: number;
  reorder_level: number;
  expiry_date?: string;
  batch_number?: string;
  location?: string;
  notes?: string;
}

const requiredFields: (keyof ProductFormData)[] = [
  'name',
  'description',
  'sku',
  'barcode',
  'category_id',
  'supplier_id',
  'unit_price',
  'selling_price',
  'quantity_in_stock',
  'reorder_level',
];

export async function getProducts(page = 1, pageSize = 10) {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          supplier:suppliers(name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      return { data, error };
    },
    'Failed to fetch products'
  );
}

export async function getProduct(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          supplier:suppliers(name)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    'Failed to fetch product'
  );
}

export async function createProduct(product: ProductFormData) {
  const supabase = createClient();
  validateRequiredFields(product, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      return { data, error };
    },
    'Failed to create product'
  );
}

export async function updateProduct(id: string, updates: Partial<ProductFormData>) {
  const supabase = createClient();
  validateRequiredFields(updates, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update product'
  );
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      return { data: null, error };
    },
    'Failed to delete product'
  );
}

export async function searchProducts(query: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          supplier:suppliers(name)
        `)
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,barcode.ilike.%${query}%`)
        .limit(10);
      return { data, error };
    },
    'Failed to search products'
  );
}

export async function updateStock(id: string, quantity: number) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .update({ quantity_in_stock: quantity })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update stock'
  );
}

export async function getLowStockProducts() {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          supplier:suppliers(name)
        `)
        .lte('quantity_in_stock', 'reorder_level');
      return { data, error };
    },
    'Failed to fetch low stock products'
  );
}

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