import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your-project') || supabaseUrl.includes('placeholder-project')) {
  console.warn(
    '⚠️  Achievers Nest: Supabase not configured.\n' +
    'Create /Volumes/Maddy/Achievers Nest/.env.local with real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
    'The app will run in offline/mock mode.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
