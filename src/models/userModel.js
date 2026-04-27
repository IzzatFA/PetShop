const supabase = require('../config/db');

const User = {
  findAll: async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  },
  findById: async (id) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (userData) => {
    const { data, error } = await supabase.from('users').insert([userData]).select();
    if (error) throw error;
    return data;
  },
  update: async (id, userData) => {
    const { data, error } = await supabase.from('users').update(userData).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { data, error } = await supabase.from('users').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }
};

module.exports = User;
