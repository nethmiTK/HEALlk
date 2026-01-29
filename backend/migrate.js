const { query } = require('./config/database');

const migrateImageFields = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Alter blogs table image column
    await query('ALTER TABLE `blogs` MODIFY COLUMN `image` LONGTEXT DEFAULT NULL');
    console.log('✅ Altered blogs.image to LONGTEXT');

    // Alter users table profile_pic column
    await query('ALTER TABLE `users` MODIFY COLUMN `profile_pic` LONGTEXT DEFAULT NULL');
    console.log('✅ Altered users.profile_pic to LONGTEXT');

    // Alter users table cover_photo column
    await query('ALTER TABLE `users` MODIFY COLUMN `cover_photo` LONGTEXT DEFAULT NULL');
    console.log('✅ Altered users.cover_photo to LONGTEXT');

    // Add address and district columns if they don't exist
    try {
      await query('ALTER TABLE `users` ADD COLUMN `address` VARCHAR(500) DEFAULT NULL');
      console.log('✅ Added users.address column');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  users.address column already exists');
      } else {
        throw error;
      }
    }

    try {
      await query('ALTER TABLE `users` ADD COLUMN `district` VARCHAR(100) DEFAULT NULL');
      console.log('✅ Added users.district column');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  users.district column already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateImageFields();
