import { createClient } from '@/lib/supabase/client';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface Order {
  id: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  customers?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          sku
        )
      ),
      customers (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getOrder(id: string): Promise<Order | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          sku
        )
      ),
      customers (
        id,
        name,
        email
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_items'>, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at' | 'updated_at'>[]): Promise<Order> {
  const supabase = createClient();
  
  // Start a transaction
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  // Add order items
  const orderItems = items.map(item => ({
    ...item,
    order_id: orderData.id
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  // Fetch the complete order with all relations
  const { data: completeOrder, error: fetchError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          sku
        )
      ),
      customers (
        id,
        name,
        email
      )
    `)
    .eq('id', orderData.id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  return completeOrder;
}

export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .update(order)
    .eq('id', id)
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          sku
        )
      ),
      customers (
        id,
        name,
        email
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = createClient();
  
  // Delete order items first
  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', id);

  if (itemsError) {
    throw itemsError;
  }

  // Then delete the order
  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (orderError) {
    throw orderError;
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          sku
        )
      ),
      customers (
        id,
        name,
        email
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePaymentStatus(id: string, payment_status: Order['payment_status']): Promise<Order> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status })
    .eq('id', id)
    .select(`
      *,
      order_items (
        *,
        products (
          id,
          name,
          sku
        )
      ),
      customers (
        id,
        name,
        email
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
} 