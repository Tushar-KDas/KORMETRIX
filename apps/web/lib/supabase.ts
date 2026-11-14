import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Browser / Client-side Supabase instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Helper to fetch data with fallback to mock data when Supabase credentials are not provided.
 */
export async function getSupabaseOrFallback<T>(
  queryFn: (client: any) => Promise<{ data: T | null; error: any }>,
  fallbackData: T
): Promise<T> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackData;
  }

  try {
    const { data, error } = await queryFn(supabase);
    if (error || !data) {
      console.warn('Supabase query returned error or null, falling back to local data:', error);
      return fallbackData;
    }
    return data;
  } catch (err) {
    console.error('Supabase exception, falling back to local data:', err);
    return fallbackData;
  }
}
