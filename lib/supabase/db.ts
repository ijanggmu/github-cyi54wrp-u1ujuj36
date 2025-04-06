import { createClient } from '@/lib/supabase/client'

export async function getProducts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function getProduct(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProduct(product: {
  name: string
  description?: string
  sku: string
  price: number
  cost?: number
  stock_quantity: number
  category_id?: string
  supplier_id?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProduct(
  id: string,
  product: Partial<{
    name: string
    description: string
    sku: string
    price: number
    cost: number
    stock_quantity: number
    category_id: string
    supplier_id: string
  }>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getOrders() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getOrder(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createOrder(order: {
  customer_id: string
  status: string
  total_amount: number
  items: Array<{
    product_id: string
    quantity: number
    unit_price: number
  }>
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_id: order.customer_id,
      status: order.status,
      total_amount: order.total_amount,
    }])
    .select()
    .single()

  if (error) throw error

  // Create order items
  const orderItems = order.items.map(item => ({
    order_id: data.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return data
}

export async function updateOrder(
  id: string,
  order: Partial<{
    status: string
    total_amount: number
  }>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .update(order)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOrder(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) throw error
} 