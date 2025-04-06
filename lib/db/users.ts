import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export async function getUsers(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUser(id: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getRoles(): Promise<Role[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRole(id: string): Promise<Role | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createRole(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roles')
    .insert([role])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRole(id: string, role: Partial<Role>): Promise<Role> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('roles')
    .update(role)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getPermissions(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('permissions')
    .select('name')
    .order('name', { ascending: true });

  if (error) throw error;
  return data?.map(p => p.name) || [];
} 