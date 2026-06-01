require('dotenv').config();
const supabase = require('./config/supabase');
const { products, categories, pricingPlans, designers, testimonials, siteStats } = require('./models/data');

async function seed() {
  console.log('🌱 Seeding database...\n');

  // 1. Categories
  console.log('📋 Inserting categories...');
  const { error: catErr } = await supabase.from('categories').upsert(
    categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, count: c.count, slug: c.slug })),
    { onConflict: 'id' }
  );
  if (catErr) { console.error('❌ Categories:', catErr.message); process.exit(1); }
  console.log(`   ✅ ${categories.length} categories\n`);

  // 2. Designers
  console.log('🎨 Inserting designers...');
  const { error: desErr } = await supabase.from('designers').upsert(
    designers.map(d => ({ id: d.id, name: d.name, avatar: d.avatar, role: d.role, products: d.products, sales: d.sales, rating: d.rating })),
    { onConflict: 'id' }
  );
  if (desErr) { console.error('❌ Designers:', desErr.message); process.exit(1); }
  console.log(`   ✅ ${designers.length} designers\n`);

  // 3. Products — map category name and designer name to IDs
  console.log('📦 Inserting products...');
  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));
  const desMap = Object.fromEntries(designers.map(d => [d.name, d.id]));

  const { error: prodErr } = await supabase.from('products').upsert(
    products.map(p => ({
      id: p.id,
      name: p.name,
      category_id: catMap[p.category] || null,
      designer_id: desMap[p.designer] || null,
      type: p.type,
      badge: p.badge,
      downloads: p.downloads,
      rating: p.rating,
      price: p.price,
      price_display: p.priceDisplay,
      description: p.description,
      count: p.count,
      format: p.format,
      color: p.color,
      is_new: p.isNew,
      is_featured: p.isFeatured,
    })),
    { onConflict: 'id' }
  );
  if (prodErr) { console.error('❌ Products:', prodErr.message); process.exit(1); }
  console.log(`   ✅ ${products.length} products\n`);

  // 4. Pricing plans
  console.log('💰 Inserting pricing plans...');
  const { error: planErr } = await supabase.from('pricing_plans').upsert(
    pricingPlans.map(p => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      popular: p.popular || false,
      monthly_price: p.monthlyPrice,
      yearly_price: p.yearlyPrice,
    })),
    { onConflict: 'id' }
  );
  if (planErr) { console.error('❌ Pricing plans:', planErr.message); process.exit(1); }
  console.log(`   ✅ ${pricingPlans.length} plans\n`);

  // 5. Pricing features
  console.log('✨ Inserting pricing features...');
  const allFeatures = pricingPlans.flatMap(plan =>
    plan.features.map(f => ({
      plan_id: plan.id,
      text: f.text,
      included: f.included !== false,
      highlight: f.highlight || false,
    }))
  );
  const { error: featErr } = await supabase.from('pricing_features').insert(allFeatures);
  if (featErr) { console.error('❌ Features:', featErr.message); process.exit(1); }
  console.log(`   ✅ ${allFeatures.length} features\n`);

  // 6. Testimonials
  console.log('💬 Inserting testimonials...');
  const { error: tesErr } = await supabase.from('testimonials').upsert(
    testimonials.map(t => ({ id: t.id, name: t.name, avatar: t.avatar, role: t.role, stars: t.stars, text: t.text })),
    { onConflict: 'id' }
  );
  if (tesErr) { console.error('❌ Testimonials:', tesErr.message); process.exit(1); }
  console.log(`   ✅ ${testimonials.length} testimonials\n`);

  // 7. Site stats
  console.log('📊 Inserting site stats...');
  const { error: statErr } = await supabase.from('site_stats').upsert(
    { id: 1, total_products: siteStats.totalProducts, total_designers: siteStats.totalDesigners, total_downloads: siteStats.totalDownloads },
    { onConflict: 'id' }
  );
  if (statErr) { console.error('❌ Stats:', statErr.message); process.exit(1); }
  console.log('   ✅ site stats\n');

  console.log('🎉 Seeding complete!');
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
