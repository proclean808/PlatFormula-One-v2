import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Configuration', () => {
  let supabase: any;

  beforeAll(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    supabase = createClient(supabaseUrl, supabaseKey);
  });

  it('should have valid Supabase URL', () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    expect(url).toMatch(/^https:\/\/.*\.supabase\.co$/);
  });

  it('should have valid Supabase anon key', () => {
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    expect(key).toBeDefined();
    expect(key.length).toBeGreaterThan(0);
  });

  it('should create Supabase client successfully', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should be able to call Supabase API', async () => {
    // Test basic connectivity by checking auth status
    const { data, error } = await supabase.auth.getSession();
    // We expect either a session (null initially) or no error
    expect(error).toBeNull();
  });
});
