const mysql = require('mysql2/promise');
require('dotenv').config();

const seedDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'heallk_db',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('🌱 Starting database seeding...');

    // Add sample doctors with specializations
    const doctors = [
      {
        full_name: 'Dr. Lakshan Perera',
        email: 'lakshan@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', // hashed password
        phone: '0774665078',
        role: 'doctor',
        specialization: 'Ayurvedic Physicians',
        status: 'accepted',
        description: 'Experienced Ayurvedic physician with 15 years of practice',
        payment_slip: '/uploads/payment-slips/lakshan_slip.jpg'
      },
      {
        full_name: 'Dr. Amara Silva',
        email: 'amara@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0716543210',
        role: 'doctor',
        specialization: 'Panchakarma Specialists',
        status: 'accepted',
        description: 'Specialist in Panchakarma treatments and detoxification',
        payment_slip: '/uploads/payment-slips/amara_slip.jpg'
      },
      {
        full_name: 'Dr. Nimal Jayasinghe',
        email: 'nimal@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0758765432',
        role: 'doctor',
        specialization: 'Wellness & Lifestyle Consultants',
        status: 'accepted',
        description: 'Wellness expert focusing on lifestyle and preventive care',
        payment_slip: '/uploads/payment-slips/nimal_slip.jpg'
      },
      {
        full_name: 'Dr. Priya De Silva',
        email: 'priya@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0712345678',
        role: 'doctor',
        specialization: 'Ayurvedic Physicians',
        status: 'accepted',
        description: 'Holistic health practitioner specializing in traditional Ayurveda',
        payment_slip: '/uploads/payment-slips/priya_slip.jpg'
      },
      // Pending doctors for admin approval
      {
        full_name: 'Dr. Roshan Kumar',
        email: 'roshan@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0778765432',
        role: 'doctor',
        specialization: 'Ayurvedic Physicians',
        status: 'requested',
        description: 'New practitioner requesting registration',
        payment_slip: '/uploads/payment-slips/roshan_slip.jpg'
      },
      {
        full_name: 'Dr. Malini Wijesinghe',
        email: 'malini@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0756543210',
        role: 'doctor',
        specialization: 'Panchakarma Specialists',
        status: 'requested',
        description: 'Certified Panchakarma specialist applying for membership',
        payment_slip: '/uploads/payment-slips/malini_slip.jpg'
      },
      {
        full_name: 'Dr. Sanjaya Goonewardene',
        email: 'sanjaya@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0745123456',
        role: 'doctor',
        specialization: 'Wellness & Lifestyle Consultants',
        status: 'requested',
        description: 'wellness consultant requesting registration',
        payment_slip: '/uploads/payment-slips/sanjaya_slip.jpg'
      },
      // Rejected doctor
      {
        full_name: 'Dr. Kalpana Fernando',
        email: 'kalpana@heallk.com',
        password: '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm',
        phone: '0734567890',
        role: 'doctor',
        specialization: 'Ayurvedic Physicians',
        status: 'rejected',
        description: 'Application rejected - incomplete credentials',
        payment_slip: '/uploads/payment-slips/kalpana_slip.jpg'
      }
    ];

    for (const doctor of doctors) {
      const sql = `
        INSERT INTO users (full_name, email, password, phone, role, specialization, status, description, payment_slip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          specialization = VALUES(specialization),
          status = VALUES(status),
          description = VALUES(description),
          payment_slip = VALUES(payment_slip)
      `;

      await connection.execute(sql, [
        doctor.full_name,
        doctor.email,
        doctor.password,
        doctor.phone,
        doctor.role,
        doctor.specialization,
        doctor.status,
        doctor.description,
        doctor.payment_slip
      ]);

      console.log(`✅ Added/Updated: ${doctor.full_name} (${doctor.status}) - ${doctor.specialization}`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('📋 Sample doctors added with specializations');

  } catch (error) {
    console.error('❌ Database seeding error:', error.message);
  } finally {
    await connection.end();
  }
};

seedDatabase();
