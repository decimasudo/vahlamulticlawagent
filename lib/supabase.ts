// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getCommunityAgents = async () => {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('community_agents')
    .insert([agent]);
  if (error) throw error;
  return data;
};
// EOF