const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

// Server-side client using the service role key.
// NEVER expose this key to the frontend — it bypasses Row Level Security.
const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = { supabaseAdmin };