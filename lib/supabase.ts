// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are missing.');
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// Fungsi untuk menyimpan Agent baru buatan user
export const saveNewAgent = async (agentData: {
  name: string;
  description: string;
  skills: string[]; // Array of skill names/slugs
  is_official: boolean;
  creator: string;
}) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('agents')
    .insert([
      {
        ...agentData,
        downloads: 0, // Mulai dari 0 download
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data;
};

// Helper function untuk fetch community agents
export const getCommunityAgents = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('community_agents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) throw error;
  return data;
};

// Helper function untuk save community agent
export const saveCommunityAgent = async (agent: any) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('community_agents')
    .insert([agent]);
  if (error) throw error;
  return data;
};
// EOF