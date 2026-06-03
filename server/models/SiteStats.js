const { supabaseAdmin: db } = require('../config/supabase');

const SiteStats = {
  async get() {
    return db.from('site_stats').select('*').single();
  },
};

module.exports = SiteStats;
