import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, validateRequiredFields, getPaginationParams } from './utils';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
  is_active: boolean;
  last_login?: string;
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

export interface UserFormData {
  email: string;
  full_name: string;
  role_id: string;
  is_active: boolean;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

const requiredUserFields: (keyof UserFormData)[] = [
  'email',
  'full_name',
  'role_id',
];

const requiredRoleFields: (keyof RoleFormData)[] = [
  'name',
  'description',
  'permissions',
];

export async function getUsers(page = 1, pageSize = 10) {
  const supabase = createClient();
  const { from, to } = getPaginationParams(page, pageSize);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          role:roles(name, description)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      return { data, error };
    },
    'Failed to fetch users'
  );
}

export async function getUser(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          role:roles(name, description, permissions)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    'Failed to fetch user'
  );
}

export async function createUser(user: UserFormData) {
  const supabase = createClient();
  validateRequiredFields(user, requiredUserFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();
      return { data, error };
    },
    'Failed to create user'
  );
}

export async function updateUser(id: string, updates: Partial<UserFormData>) {
  const supabase = createClient();
  validateRequiredFields(updates, requiredUserFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update user'
  );
}

export async function deleteUser(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      return { data: null, error };
    },
    'Failed to delete user'
  );
}

export async function getRoles() {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      return { data, error };
    },
    'Failed to fetch roles'
  );
}

export async function getRole(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    'Failed to fetch role'
  );
}

export async function createRole(role: RoleFormData) {
  const supabase = createClient();
  validateRequiredFields(role, requiredRoleFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('roles')
        .insert([role])
        .select()
        .single();
      return { data, error };
    },
    'Failed to create role'
  );
}

export async function updateRole(id: string, updates: Partial<RoleFormData>) {
  const supabase = createClient();
  validateRequiredFields(updates, requiredRoleFields);

  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    'Failed to update role'
  );
}

export async function deleteRole(id: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);
      return { data: null, error };
    },
    'Failed to delete role'
  );
}

export async function searchUsers(query: string) {
  const supabase = createClient();
  return handleSupabaseError(
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          role:roles(name, description)
        `)
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(10);
      return { data, error };
    },
    'Failed to search users'
  );
} 