const supabase = require('../config/db');

const Category = {
  findAll: async () => {
    const { data, error } = await supabase.from('categories').select('*').is('deleted_at', null);
    if (error) throw error;
    return data;
  },
  findById: async (id) => {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).is('deleted_at', null).single();
    if (error) throw error;
    return data;
  },
  create: async (categoryData) => {
    const { data, error } = await supabase.from('categories').insert([categoryData]).select();
    if (error) throw error;
    return data;
  },
  update: async (id, categoryData) => {
    const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    // Soft delete per ERD (deleted_at field)
    const { data, error } = await supabase.from('categories').update({ deleted_at: new Date() }).eq('id', id).select();
    if (error) throw error;
    return data;
  }
};

module.exports = Category;
