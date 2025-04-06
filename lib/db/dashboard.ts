import { createClient } from '@/lib/supabase/client';

export interface DashboardMetrics {
  totalProducts: number;
  lowStockItems: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
  topProducts: {
    id: string;
    name: string;
    quantity_sold: number;
    revenue: number;
  }[];
  salesTrend: {
    date: string;
    total: number;
  }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = createClient();

  // Get total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Get low stock items
  const { count: lowStockItems } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true })
    .lte('quantity', supabase.rpc('get_reorder_level'));

  // Get total orders and revenue
  const { data: ordersData } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .eq('status', 'completed');

  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      customers (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get top selling products
  const { data: topProducts } = await supabase
    .from('order_items')
    .select(`
      product_id,
      quantity,
      price,
      products (
        name
      )
    `)
    .order('quantity', { ascending: false })
    .limit(5);

  // Get sales trend (last 7 days)
  const { data: salesTrend } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true });

  return {
    totalProducts: totalProducts || 0,
    lowStockItems: lowStockItems || 0,
    totalOrders,
    totalRevenue,
    recentOrders: recentOrders?.map(order => ({
      id: order.id,
      customer_name: order.customers?.name || 'Unknown',
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
    })) || [],
    topProducts: topProducts?.map(item => ({
      id: item.product_id,
      name: item.products?.name || 'Unknown',
      quantity_sold: item.quantity,
      revenue: item.quantity * item.price,
    })) || [],
    salesTrend: salesTrend?.map(order => ({
      date: new Date(order.created_at).toLocaleDateString(),
      total: order.total_amount,
    })) || [],
  };
} 