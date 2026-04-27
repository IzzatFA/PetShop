const supabase = require('../config/db');

const Animal = {
  findAll: async () => {
    const { data, error } = await supabase.from('animals').select('*').is('deleted_at', null);
    if (error) throw error;
    return data;
  },
  findById: async (id) => {
    const { data, error } = await supabase.from('animals').select('*').eq('id', id).is('deleted_at', null).single();
    if (error) throw error;
    return data;
  },
  create: async (animalData) => {
    const { data, error } = await supabase.from('animals').insert([animalData]).select();
    if (error) throw error;
    return data;
  },
  update: async (id, animalData) => {
    const { data, error } = await supabase.from('animals').update(animalData).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    // Soft delete per ERD (deleted_at field)
    const { data, error } = await supabase.from('animals').update({ deleted_at: new Date() }).eq('id', id).select();
    if (error) throw error;
    return data;
  }
};

module.exports = Animal;
