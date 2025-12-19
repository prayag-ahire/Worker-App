import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// TODO: Move these to .env file
const SUPABASE_URL = 'https://etzufhrpjqycpmybqswe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0enVmaHJwanF5Y3BteWJxc3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODc2NDYsImV4cCI6MjA4MDc2MzY0Nn0.3SITVVKI7gmYgegSBXp5WtGkcU1NfLUC5Tz1S8USacY';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in src/services/supabaseClient.ts');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
