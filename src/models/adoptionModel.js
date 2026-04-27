const supabase = require('../config/db');

const Adoption = {
  findAll: async () => {
    const { data, error } = await supabase.from('adoptions').select('*, users(*), animals(*)');
    if (error) throw error;
    return data;
  },
  findById: async (id) => {
    const { data, error } = await supabase.from('adoptions').select('*, users(*), animals(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  findByUser: async (user_id) => {
    const { data, error } = await supabase.from('adoptions').select('*, animals(*)').eq('user_id', user_id);
    if (error) throw error;
    return data;
  },
  create: async (adoptionData) => {
    const { data, error } = await supabase.from('adoptions').insert([adoptionData]).select();
    if (error) throw error;
    return data;
  },
  updateStatus: async (id, status) => {
    const { data, error } = await supabase.from('adoptions').update({ status }).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { data, error } = await supabase.from('adoptions').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }
};

module.exports = Adoption;
