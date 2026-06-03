const { supabaseAdmin: db } = require('../config/supabase');

const PricingPlan = {
  async findAll() {
    return db
      .from('pricing_plans')
      .select('*, pricing_features(*)')
      .order('monthly_price');
  },
};

module.exports = PricingPlan;
