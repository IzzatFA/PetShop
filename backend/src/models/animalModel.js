import db from '../config/db.js';

const getAllAnimals = async () => {
  const result = await db.query(`
    SELECT a.*, c.name as category_name
    FROM animals a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.deleted_at IS NULL
    ORDER BY a.created_at DESC
  `);
  return result.rows;
};

const getAnimalById = async (id) => {
  const result = await db.query(`
    SELECT a.*, c.name as category_name
    FROM animals a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = $1 AND a.deleted_at IS NULL
  `, [id]);
  return result.rows[0];
};

const createAnimal = async (category_id, breed, age, description, status = 'available', image_url = null) => {
  const result = await db.query(
    'INSERT INTO animals (category_id, breed, age, description, status, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [category_id, breed, age, description, status, image_url]
  );
  return result.rows[0];
};

const updateAnimal = async (id, data) => {
  const { category_id, breed, age, description, status, image_url } = data;
  const result = await db.query(
    'UPDATE animals SET category_id = COALESCE($1, category_id), breed = COALESCE($2, breed), age = COALESCE($3, age), description = COALESCE($4, description), status = COALESCE($5, status), image_url = COALESCE($6, image_url) WHERE id = $7 AND deleted_at IS NULL RETURNING *',
    [category_id, breed, age, description, status, image_url, id]
  );
  return result.rows[0];
};

const deleteAnimal = async (id) => {
  const result = await db.query(
    'UPDATE animals SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

export default {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};
