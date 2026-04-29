import db from '../config/db.js';

const createAppointment = async (user_id, animal_id, date, note) => {
  const result = await db.query(
    'INSERT INTO appointments (user_id, animal_id, date, note) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, animal_id, date, note]
  );
  return result.rows[0];
};

const getAppointmentsByUserId = async (user_id) => {
  const result = await db.query(`
    SELECT ap.*, an.breed, an.description, c.name as category_name
    FROM appointments ap
    JOIN animals an ON ap.animal_id = an.id
    LEFT JOIN categories c ON an.category_id = c.id
    WHERE ap.user_id = $1
    ORDER BY ap.date ASC
  `, [user_id]);
  return result.rows;
};

const getAllAppointments = async () => {
  const result = await db.query(`
    SELECT ap.*, an.breed, an.description as animal_desc, c.name as category_name, u.name as user_name, u.email as user_email
    FROM appointments ap
    JOIN animals an ON ap.animal_id = an.id
    LEFT JOIN categories c ON an.category_id = c.id
    JOIN users u ON ap.user_id = u.id
    ORDER BY ap.date ASC
  `);
  return result.rows;
};

export default {
  createAppointment,
  getAppointmentsByUserId,
  getAllAppointments,
};
