const { query } = require('./config/database');

const testDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    // Get users table structure
    const result = await query('DESCRIBE users');
    console.log('✅ Connected to database');
    console.log('\n📋 Users table structure:');
    result.forEach(row => {
      console.log(`  - ${row.Field}: ${row.Type}`);
    });

    // Check if address and district columns exist
    const addressCol = result.find(col => col.Field === 'address');
    const districtCol = result.find(col => col.Field === 'district');
    
    console.log('\n🔍 Column check:');
    console.log(`  - address column: ${addressCol ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  - district column: ${districtCol ? '✅ EXISTS' : '❌ MISSING'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
};

testDatabase();
