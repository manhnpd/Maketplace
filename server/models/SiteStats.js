const supabase = require('../config/supabase');

const SiteStats = {
  async get() {
    return supabase.from('site_stats').select('*').single();
  },
};

module.exports = SiteStats;
