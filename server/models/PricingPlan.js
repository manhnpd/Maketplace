const supabase = require('../config/supabase');

const PricingPlan = {
  async findAll() {
    return supabase
      .from('pricing_plans')
      .select('*, pricing_features(*)')
      .order('monthly_price');
  },
};

module.exports = PricingPlan;
