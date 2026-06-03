const { supabaseAdmin: db } = require('../config/supabase');

const Testimonial = {
  async findAll() {
    return db.from('testimonials').select('*').order('id');
  },
};

module.exports = Testimonial;
