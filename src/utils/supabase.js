import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://ffkrsrlmwpyhlgilblte.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma3Jzcmxtd3B5aGxnaWxibHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk0Mzg0NTksImV4cCI6MTk4NTAxNDQ1OX0.4ueapsp9zeGZKR0flUhZe5XbbJxYHCZkEMpKAFZzXOM',
);

export default supabase;