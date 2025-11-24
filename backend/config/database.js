const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'heallk_db',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Initialize database (create tables if they don't exist)
const initializeDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createUsersTable);
    console.log('✅ Users table ensured');

    // Create reviews table if it doesn't exist
    const createReviewsTable = `
      CREATE TABLE IF NOT EXISTS reviews (
        review_id INT PRIMARY KEY AUTO_INCREMENT,
        patient_name VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        date_of_visit DATE,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createReviewsTable);
    console.log('✅ Reviews table ensured');

    // Create doctor_qualifications table if it doesn't exist
    const createQualificationsTable = `
      CREATE TABLE IF NOT EXISTS doctor_qualifications (
        qualification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        degree_name VARCHAR(100) NOT NULL,
        specialization VARCHAR(150) NOT NULL,
        institution VARCHAR(200) NOT NULL,
        year_completed YEAR NOT NULL,
        description TEXT NULL,
        certificate_url TEXT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createQualificationsTable);
    console.log('✅ Doctor qualifications table ensured');

    // Create clinic_info table if it doesn't exist
    const createClinicInfoTable = `
      CREATE TABLE IF NOT EXISTS clinic_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        clinic_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20),
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        website VARCHAR(255),
        description TEXT,
        specializations JSON,
        facilities JSON,
        working_hours JSON,
        emergency_contact VARCHAR(20),
        insurance_accepted JSON,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createClinicInfoTable);
    console.log('✅ Clinic info table ensured');

    // Add description column to users table if it doesn't exist
    try {
      const descriptionColumnExists = await query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE table_schema = ? AND table_name = 'users' AND column_name = 'description'
      `, [process.env.DB_NAME || 'heallk_db']);

      if (descriptionColumnExists[0].count === 0) {
        await query(`
          ALTER TABLE users 
          ADD COLUMN description TEXT NULL
        `);
        console.log('✅ Added description column to users table');
      }
    } catch (error) {
      console.warn('Description column check/creation warning:', error.message);
    }

    // Create reviews table if it doesn't exist
    const createReviewsTableNew = `
      CREATE TABLE IF NOT EXISTS doctor_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        doctor_id INT NOT NULL,
        reviewer_name VARCHAR(255) NOT NULL,
        reviewer_email VARCHAR(255),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createReviewsTableNew);
    console.log('✅ Doctor reviews table ensured');

    // Check if status column exists and add it if it doesn't
    try {
      const statusColumnExists = await query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE table_schema = ? AND table_name = 'reviews' AND column_name = 'status'
      `, [process.env.DB_NAME || 'heallk_db']);

      if (statusColumnExists[0].count === 0) {
        await query(`
          ALTER TABLE reviews 
          ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
        `);
        console.log('✅ Added status column to reviews table');
      }
    } catch (error) {
      console.warn('Status column check/creation warning:', error.message);
    }

    // Check if profile_pic column exists and add it if it doesn't
    try {
      const profilePicColumnExists = await query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE table_schema = ? AND table_name = 'users' AND column_name = 'profile_pic'
      `, [process.env.DB_NAME || 'heallk_db']);

      if (profilePicColumnExists[0].count === 0) {
        await query(`
          ALTER TABLE users 
          ADD COLUMN profile_pic TEXT NULL
        `);
        console.log('✅ Added profile_pic column to users table');
      }
    } catch (error) {
      console.warn('Profile pic column check/creation warning:', error.message);
    }

    // Create services table if it doesn't exist
    const createServicesTable = `
      CREATE TABLE IF NOT EXISTS services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        doctor_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        duration VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        media_urls JSON NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_doctor_id (doctor_id),
        INDEX idx_category (category),
        INDEX idx_is_active (is_active),
        INDEX idx_created_at (created_at),
        
        CONSTRAINT fk_services_doctor
          FOREIGN KEY (doctor_id) REFERENCES users(user_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createServicesTable);
    console.log('✅ Services table ensured');

    // Create service categories table if it doesn't exist
    const createServiceCategoriesTable = `
      CREATE TABLE IF NOT EXISTS service_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createServiceCategoriesTable);
    console.log('✅ Service categories table ensured');

    // Insert default service categories if table is empty
    const categoryCount = await query('SELECT COUNT(*) as count FROM service_categories');
    if (categoryCount[0].count === 0) {
      const defaultCategories = [
        ['General Consultation', 'Basic medical consultations and health assessments'],
        ['Specialist Consultation', 'Specialized medical consultations in various fields'],
        ['Diagnostic Services', 'Medical tests, imaging, and diagnostic procedures'],
        ['Treatment Services', 'Medical treatments and therapeutic procedures'],
        ['Emergency Care', 'Urgent medical care and emergency services'],
        ['Preventive Care', 'Preventive medicine and health screenings']
      ];

      for (const [name, description] of defaultCategories) {
        await query(
          'INSERT INTO service_categories (name, description) VALUES (?, ?)',
          [name, description]
        );
      }
      console.log('✅ Default service categories inserted');
    }

    // Create indexes for better performance
    const userIndexes = [
      { table: 'users', name: 'idx_email', column: 'email' },
      { table: 'users', name: 'idx_role', column: 'role' }
    ];

    const reviewIndexes = [
      { table: 'reviews', name: 'idx_rating', column: 'rating' },
      { table: 'reviews', name: 'idx_status', column: 'status' },
      { table: 'reviews', name: 'idx_created_at', column: 'created_at' }
    ];

    const serviceIndexes = [
      { table: 'services', name: 'idx_services_doctor_id', column: 'doctor_id' },
      { table: 'services', name: 'idx_services_category', column: 'category' },
      { table: 'services', name: 'idx_services_is_active', column: 'is_active' },
      { table: 'services', name: 'idx_services_created_at', column: 'created_at' }
    ];

    const allIndexes = [...userIndexes, ...reviewIndexes, ...serviceIndexes];

    for (const index of allIndexes) {
      try {
        const exists = await query(
          'SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = ? AND table_name = ? AND index_name = ?',
          [process.env.DB_NAME || 'heallk_db', index.table, index.name]
        );
        
        if (exists[0].count === 0) {
          await query(`CREATE INDEX ${index.name} ON ${index.table}(${index.column})`);
          console.log(`✅ ${index.name} created on ${index.table}`);
        }
      } catch (error) {
        if (error.code !== 'ER_DUP_KEYNAME') {
          console.warn(`${index.name} warning:`, error.message);
        }
      }
    }

    console.log(' Database initialization completed');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

// For operations that need access to metadata like insertId
const execute = async (sql, params = []) => {
  try {
    return await pool.execute(sql, params);
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  execute,
  testConnection,
  initializeDatabase
};