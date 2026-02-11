// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are required but not set.');
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const getSupabaseClient = getSupabase;

export const getCommunityAgents = async () => {
  const { data, error } = await getSupabase()
    .from('community_agents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("Supabase Error:", error);
    return [];
  }
  return data;
};

export const saveCommunityAgent = async (agent: any) => {
  const { data, error } = await getSupabase()
    .from('community_agents')
    .insert([agent]);
  if (error) throw error;
  return data;
};
// EOF