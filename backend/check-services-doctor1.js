const { query } = require('./config/database');

async function checkServicesForDoctor1() {
  try {
    // Check if doctor with ID 1 exists
    const doctor = await query('SELECT user_id, full_name FROM users WHERE user_id = 1');
    console.log('Doctor ID 1:', doctor);

    // Check services for doctor ID 1
    const services = await query('SELECT * FROM services WHERE doctor_id = 1');
    console.log('Services for doctor ID 1:', services);

    if (services.length === 0) {
      console.log('No services found for doctor ID 1. Adding sample services...');
      
      const sampleServices = [
        {
          title: 'Ayurvedic Consultation',
          description: 'Complete health assessment and personalized treatment plan',
          duration: '45 minutes',
          price: 3000.00,
          category: 'General Consultation'
        },
        {
          title: 'Panchakarma Treatment',
          description: 'Traditional detoxification and rejuvenation therapy',
          duration: '2 hours',
          price: 8000.00,
          category: 'Treatment Services'
        },
        {
          title: 'Herbal Medicine Consultation',
          description: 'Personalized herbal prescriptions and guidance',
          duration: '30 minutes',
          price: 2500.00,
          category: 'Specialist Consultation'
        }
      ];

      for (const service of sampleServices) {
        await query(
          'INSERT INTO services (doctor_id, title, description, duration, price, category, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [1, service.title, service.description, service.duration, service.price, service.category, 1]
        );
      }
      
      console.log('Sample services added for doctor ID 1!');
    }

    // Check final services
    const finalServices = await query('SELECT * FROM services WHERE doctor_id = 1');
    console.log('Final services for doctor ID 1:', finalServices.length, 'services');

  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkServicesForDoctor1();