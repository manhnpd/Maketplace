const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Admin client — uses service_role key, never calls auth methods.
// This avoids the session-poisoning issue where auth.signUp() stores
// a user JWT internally, causing subsequent .from() calls to use the
// user's JWT instead of service_role (which then gets blocked by RLS).
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Auth client — safe to call auth.signUp / signInWithPassword.
// After these calls the client holds a user session, so do NOT use
// this client for admin-level DB operations (service_role bypass).
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
module.exports.supabaseAdmin = supabaseAdmin;
