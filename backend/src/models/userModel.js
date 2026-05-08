import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const createUser = async (name, email, password, role = 'user') => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const updateUser = async (id, data) => {
  const { name, email, password } = data;
  let hashedPassword = null;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const result = await db.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         password = COALESCE($3, password)
     WHERE id = $4
     RETURNING *`,
    [name, email, hashedPassword, id]
  );

  return result.rows[0];
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  comparePassword,
};
