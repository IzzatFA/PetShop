import db from '../config/db.js';

const createAdoption = async (user_id, animal_id) => {
  const result = await db.query(
    'INSERT INTO adoptions (user_id, animal_id) VALUES ($1, $2) RETURNING *',
    [user_id, animal_id]
  );
  return result.rows[0];
};

const getAdoptionsByUserId = async (user_id) => {
  const result = await db.query(`
    SELECT ad.*, an.breed, an.description, c.name as category_name
    FROM adoptions ad
    JOIN animals an ON ad.animal_id = an.id
    LEFT JOIN categories c ON an.category_id = c.id
    WHERE ad.user_id = $1
    ORDER BY ad.created_at DESC
  `, [user_id]);
  return result.rows;
};

const getAllAdoptions = async () => {
  const result = await db.query(`
    SELECT ad.*, an.breed, an.description as animal_desc, c.name as category_name, u.name as user_name, u.email as user_email
    FROM adoptions ad
    JOIN animals an ON ad.animal_id = an.id
    LEFT JOIN categories c ON an.category_id = c.id
    JOIN users u ON ad.user_id = u.id
    ORDER BY ad.created_at DESC
  `);
  return result.rows;
};

const updateAdoptionStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE adoptions SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

export default {
  createAdoption,
  getAdoptionsByUserId,
  getAllAdoptions,
  updateAdoptionStatus,
};
