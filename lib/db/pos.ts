import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, validateRequiredFields, getPaginationParams } from './utils';
import { Customer } from './customers';
import { Product } from './products';

export interface Order {
  id: string;
  customer_id: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  payment_method: 'cash' | 'card' | 'phonepe' | 'upi' | 'insurance';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  created_at: string;
  product?: Product;
}

export interface OrderFormData {
  customer_id?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
  }[];
  payment_method: Order['payment_method'];
  discount_amount: number;
  tax_amount: number;
  notes?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total: number;
}

interface InventoryTransaction {
  id: string;
  product_id: string;
  quantity: number;
  type: 'in' | 'out';
  reference_id: string;
  reference_type: 'order' | 'adjustment';
  created_at: string;
  products: Product;
}

const requiredFields: (keyof OrderFormData)[] = [
  'items',
  'payment_method',
];

export async function createOrder(orderData: OrderFormData) {
  const supabase = createClient();
  validateRequiredFields(orderData, requiredFields);

  // Calculate total amount
  const total_amount = orderData.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unit_price;
    return sum + (itemTotal - item.discount_amount);
  }, 0);

  // Apply global discount and tax
  const final_amount = total_amount - orderData.discount_amount + orderData.tax_amount;

  return handleSupabaseError(
    async () => {
      // Start a Supabase transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: orderData.customer_id,
          total_amount: final_amount,
          discount_amount: orderData.discount_amount,
          tax_amount: orderData.tax_amount,
          status: 'pending',
          payment_method: orderData.payment_method,
          payment_status: 'pending',
          notes: orderData.notes,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock and create inventory transactions
      for (const item of orderData.items) {
        // Get current product stock
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();

        if (productError) throw productError;

        // Update product stock
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq('id', item.product_id);

        if (stockError) throw stockError;

        // Create inventory transaction
        const { error: transactionError } = await supabase
          .from('inventory_transactions')
          .insert([{
            product_id: item.product_id,
            transaction_type: 'sale',
            quantity: -item.quantity,
            reference_id: order.id,
            notes: `Sale order #${order.id}`,
          }]);

        if (transactionError) throw transactionError;
      }

      return order;
    },
    'Failed to create order'
  );
}

export async function getOrders(page = 1, pageSize = 10, searchQuery = '') {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError<Order[]>(
    async () => {
      let query = supabase
        .from('orders')
        .select('*, customers(*), order_items(*, products(*))', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`id.ilike.%${searchQuery}%,customers.name.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      return { data: data as Order[], error: null, count };
    },
    'Failed to fetch orders'
  );
}

export async function getOrderById(id: string) {
  const supabase = createClient();

  return handleSupabaseError<Order>(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(*), order_items(*, products(*))')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as Order, error: null };
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

      if (error) throw error;
      return data;
    },
    'Failed to update order status'
  );
}

export async function updatePaymentStatus(id: string, payment_status: Order['payment_status']) {
  const supabase = createClient();

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .update({ payment_status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    'Failed to update payment status'
  );
}

export async function getRecentOrders(limit = 5) {
  const supabase = createClient();

  return handleSupabaseError<Order[]>(
    async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(*), order_items(*, products(*))')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data: data as Order[], error: null };
    },
    'Failed to fetch recent orders'
  );
}

export async function getProductStock(productId: string) {
  const supabase = createClient();

  return handleSupabaseError<number>(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return { data: data.stock_quantity, error: null };
    },
    'Failed to fetch product stock'
  );
}

export async function getProducts(page = 1, pageSize = 10, searchQuery = '') {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError<Product[]>(
    async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('name');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      return { data: data as Product[], error: null, count };
    },
    'Failed to fetch products'
  );
}

export async function getCustomers(page = 1, pageSize = 10, searchQuery = '') {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError<Customer[]>(
    async () => {
      let query = supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('name');

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      return { data: data as Customer[], error: null, count };
    },
    'Failed to fetch customers'
  );
}

export async function createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    },
    'Failed to create customer'
  );
}

export async function getProductById(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    },
    'Failed to fetch product'
  );
}

export async function updateProductStock(productId: string, quantity: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: quantity })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createInventoryTransaction(transactionData: {
  product_id: string;
  transaction_type: 'purchase' | 'sale' | 'adjustment';
  quantity: number;
  reference_id?: string;
  notes?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert([transactionData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInventoryTransactions(page = 1, pageSize = 10) {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError<InventoryTransaction[]>(
    async () => {
      const { data, error, count } = await supabase
        .from('inventory_transactions')
        .select('*, products(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data as InventoryTransaction[], error: null, count };
    },
    'Failed to fetch inventory transactions'
  );
} 