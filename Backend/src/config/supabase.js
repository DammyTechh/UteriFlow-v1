import { createClient } from '@supabase/supabase-js';

const getUrl  = () => process.env.SUPABASE_URL;
const getAnon = () => process.env.SUPABASE_ANON_KEY;
const getSvc  = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase      = null;
let _supabaseAdmin = null;

export const getSupabase = () => {
  if (!_supabase) {
    _supabase = createClient(getUrl(), getAnon(), {
      auth: { autoRefreshToken: true, persistSession: false, detectSessionInUrl: false },
    });
  }
  return _supabase;
};

export const getSupabaseAdmin = () => {
  if (!_supabaseAdmin) {
    const svc = getSvc();
    if (!svc) return null;
    _supabaseAdmin = createClient(getUrl(), svc, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
};

export default { 
  get auth()           { return getSupabase().auth; },
  from(table)          { return getSupabase().from(table); },
};

export const supabaseAdmin = {
  get auth()           { return getSupabaseAdmin()?.auth; },
  from(table)          { return getSupabaseAdmin()?.from(table); },
};

export const supabase = {
  get auth()           { return getSupabase().auth; },
  from(table)          { return getSupabase().from(table); },
};
