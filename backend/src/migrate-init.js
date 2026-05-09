import db from './config/db.js';

const migrate = async () => {
  try {
    console.log('🚀 Starting database migration...\n');

    // 1. Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "users" created successfully');

    // 2. Create categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "categories" created successfully');

    // 3. Create animals table
    await db.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        breed VARCHAR(255) NOT NULL,
        age VARCHAR(100),
        description TEXT,
        status VARCHAR(50) DEFAULT 'available',
        image_url TEXT,
        price NUMERIC DEFAULT 0,
        deleted_at TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "animals" created successfully');

    // 4. Create adoptions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS adoptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
        adopter_name VARCHAR(255),
        adopter_email VARCHAR(255),
        adopter_phone VARCHAR(50),
        adopter_address TEXT,
        experience VARCHAR(50),
        experience_detail TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "adoptions" created successfully');

    // 5. Create appointments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL,
        note TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "appointments" created successfully');

    console.log('\n🎉 All tables created successfully!');
    console.log('\nDatabase schema:');
    console.log('  - users (id, name, email, password, role, created_at)');
    console.log('  - categories (id, name, created_at)');
    console.log('  - animals (id, category_id → categories, breed, age, description, status, image_url, price, deleted_at, created_at)');
    console.log('  - adoptions (id, user_id → users, animal_id → animals, adopter_name, adopter_email, adopter_phone, adopter_address, experience, experience_detail, status, created_at)');
    console.log('  - appointments (id, user_id → users, animal_id → animals, date, note, status, created_at)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
