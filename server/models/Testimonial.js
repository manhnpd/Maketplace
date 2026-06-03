const supabase = require('../config/supabase');

const Testimonial = {
  async findAll() {
    return supabase.from('testimonials').select('*').order('id');
  },
};

module.exports = Testimonial;
