import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, validateRequiredFields, getPaginationParams } from './utils';

export interface Order {
  id: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: 'cash' | 'card' | 'insurance';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderFormData {
  customer_id: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
  payment_method: 'cash' | 'card' | 'insurance';
  notes?: string;
}

const requiredFields: (keyof OrderFormData)[] = [
  'customer_id',
  'items',
  'payment_method',
];

export async function createOrder(order: OrderFormData) {
  const supabase = createClient();
  validateRequiredFields(order, requiredFields);

  return handleSupabaseError(
    async () => {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: order.customer_id,
          total_amount: 0, // Will be calculated from items
          status: 'pending',
          payment_method: order.payment_method,
          payment_status: 'pending',
          notes: order.notes,
        }])
        .select()
        .single();

      if (orderError) {
        return { data: null, error: orderError };
      }

      // Calculate total amount and create order items
      let totalAmount = 0;
      const orderItems = [];

      for (const item of order.items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('selling_price, quantity_in_stock')
          .eq('id', item.product_id)
          .single();

        if (productError) {
          return { data: null, error: productError };
        }

        const unitPrice = product.selling_price;
        const totalPrice = unitPrice * item.quantity;
        totalAmount += totalPrice;

        orderItems.push({
          order_id: orderData.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
        });

        // Update product quantity
        const { error: stockError } = await supabase
          .from('products')
          .update({ quantity_in_stock: product.quantity_in_stock - item.quantity })
          .eq('id', item.product_id);

        if (stockError) {
          return { data: null, error: stockError };
        }
      }

      // Update order total amount
      const { error: updateError } = await supabase
        .from('orders')
        .update({ total_amount: totalAmount })
        .eq('id', orderData.id);

      if (updateError) {
        return { data: null, error: updateError };
      }

      // Create order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        return { data: null, error: itemsError };
      }

      return { data: orderData, error: null };
    },
    'Failed to create order'
  );
}

export async function getOrder(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(name, email, phone),
          items:order_items(
            *,
            product:products(name, sku)
          )
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    'Failed to fetch order'
  );
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update order status'
  );
}

export async function updatePaymentStatus(id: string, status: Order['payment_status']) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update payment status'
  );
}

export async function getOrders(page = 1, pageSize = 10) {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(name, email, phone),
          items:order_items(
            *,
            product:products(name, sku)
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      return { data, error };
    },
    'Failed to fetch orders'
  );
}

export async function searchOrders(query: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(name, email, phone),
          items:order_items(
            *,
            product:products(name, sku)
          )
        `)
        .or(`id.eq.${query},customer:customers(name).ilike.%${query}%`)
        .limit(10);
      return { data, error };
    },
    'Failed to search orders'
  );
}

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