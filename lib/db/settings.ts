import { createClient } from '@/lib/supabase/client';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  created_at: string;
  updated_at: string;
}

export async function getUserSettings(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data as UserSettings;
}

export async function updateUserSettings(userId: string, updates: Partial<UserSettings>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as UserSettings;
}

export async function createUserSettings(userId: string, settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_settings')
    .insert([{ ...settings, user_id: userId }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as UserSettings;
}

export async function deleteUserSettings(userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_settings')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}