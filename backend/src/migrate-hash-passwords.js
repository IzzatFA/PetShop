/**
 * Migration Script: Hash existing plain text passwords in the database
 * 
 * Run once: node src/migrate-hash-passwords.js
 * 
 * This script will:
 * 1. Fetch all users from the database
 * 2. Check if password is already hashed (bcrypt hashes start with "$2a$" or "$2b$")
 * 3. Hash plain text passwords and update them in the database
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migratePasswords() {
  try {
    console.log('🔄 Starting password migration...');
    
    const { rows: users } = await pool.query('SELECT id, email, password FROM users');
    console.log(`📋 Found ${users.length} users in database`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      // Skip if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        console.log(`⏭️  User ${user.email} - password already hashed, skipping`);
        skipped++;
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
      console.log(`✅ User ${user.email} - password hashed successfully`);
      migrated++;
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   Migrated: ${migrated}`);
    console.log(`   Skipped (already hashed): ${skipped}`);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

migratePasswords();
