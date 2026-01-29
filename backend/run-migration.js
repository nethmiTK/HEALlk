#!/usr/bin/env node

require('dotenv').config();
const mysql = require('mysql2/promise');

const runMigration = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'heallk_db'
    });

    console.log('🔄 Running database migrations...');

    // Migrate blogs image column
    await connection.execute('ALTER TABLE `blogs` MODIFY COLUMN `image` LONGTEXT DEFAULT NULL');
    console.log('✅ Altered blogs.image to LONGTEXT');

    // Migrate users profile_pic column
    await connection.execute('ALTER TABLE `users` MODIFY COLUMN `profile_pic` LONGTEXT DEFAULT NULL');
    console.log('✅ Altered users.profile_pic to LONGTEXT');

    // Migrate users cover_photo column
    await connection.execute('ALTER TABLE `users` MODIFY COLUMN `cover_photo` LONGTEXT DEFAULT NULL');
    console.log('✅ Altered users.cover_photo to LONGTEXT');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

runMigration();
