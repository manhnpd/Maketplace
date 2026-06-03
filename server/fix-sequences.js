/**
 * Reset PostgreSQL sequences after seed data with explicit IDs.
 * Seed uses upsert with specific IDs, so auto-increment sequences
 * stay at 1 and cause "duplicate key" errors on new inserts.
 *
 * Run: cd server && node fix-sequences.js
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TABLES = [
  { table: 'products', column: 'id' },
  { table: 'categories', column: 'id' },
  { table: 'designers', column: 'id' },
  { table: 'pricing_plans', column: 'id' },
  { table: 'pricing_features', column: 'id' },
  { table: 'testimonials', column: 'id' },
  { table: 'site_stats', column: 'id' },
  { table: 'reviews', column: 'id' },
  { table: 'designer_applications', column: 'id' },
];

async function fixSequences() {
  console.log('🔧 Resetting PostgreSQL sequences...\n');

  for (const { table, column } of TABLES) {
    const seqName = `${table}_${column}_seq`;
    const sql = `SELECT setval('${seqName}', COALESCE((SELECT MAX(${column}) FROM ${table}), 1));`;

    // Use the REST API's RPC or direct query approach
    // Supabase JS v2 doesn't support raw SQL, so we use the PostgREST approach
    // We need to check max ID and manually insert to advance sequence
    const { data } = await supabase.from(table).select(column).order(column, { ascending: false }).limit(1);

    if (data && data.length > 0) {
      const maxId = data[0][column];
      console.log(`  ${table}: max ${column}=${maxId} — needs sequence reset`);
      console.log(`    Run in SQL Editor: SELECT setval('${seqName}', ${maxId});`);
    } else {
      console.log(`  ${table}: empty — no reset needed`);
    }
  }

  // Also check for orders table if it exists
  const { error: ordersErr } = await supabase.from('orders').select('id').limit(1);
  if (!ordersErr) {
    console.log(`\n  orders: table exists — check if sequence needs reset`);
  }

  console.log('\n⚠️  Supabase JS client cannot run raw SQL.');
  console.log('   Please run the generated SQL statements above in the Supabase SQL Editor.');
  console.log('\n   Or run this single statement to fix all sequences:');
  console.log(`
   DO $$
   DECLARE
     r RECORD;
   BEGIN
     FOR r IN
       SELECT sequencename FROM pg_sequences WHERE schemaname = 'public'
     LOOP
       EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(id) FROM %I), 1))',
         r.sequencename,
         replace(r.sequencename, '_id_seq', ''));
     END LOOP;
   END $$;`);
}

fixSequences().catch(console.error);
