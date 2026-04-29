import db from '../config/db.js';

const getAllCategories = async () => {
  const result = await db.query('SELECT * FROM categories ORDER BY id ASC');
  return result.rows;
};

const createCategory = async (name) => {
  const result = await db.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

export default {
  getAllCategories,
  createCategory,
};
