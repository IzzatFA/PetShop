const supabase = require('../config/db');

const Appointment = {
  findAll: async () => {
    const { data, error } = await supabase.from('appointments').select('*, users(*), animals(*)');
    if (error) throw error;
    return data;
  },
  findById: async (id) => {
    const { data, error } = await supabase.from('appointments').select('*, users(*), animals(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  findByUser: async (user_id) => {
    const { data, error } = await supabase.from('appointments').select('*, animals(*)').eq('user_id', user_id);
    if (error) throw error;
    return data;
  },
  create: async (appointmentData) => {
    const { data, error } = await supabase.from('appointments').insert([appointmentData]).select();
    if (error) throw error;
    return data;
  },
  update: async (id, appointmentData) => {
    const { data, error } = await supabase.from('appointments').update(appointmentData).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { data, error } = await supabase.from('appointments').delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }
};

module.exports = Appointment;
