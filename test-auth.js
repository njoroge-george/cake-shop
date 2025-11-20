const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  console.log('🔍 Testing Authentication...\n');

  // Check if users exist
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, password: true }
  });

  console.log(`✅ Found ${users.length} users in database:\n`);
  
  for (const user of users) {
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`🔒 Password hash exists: ${user.password ? 'Yes' : 'No'}`);
    
    // Test password
    if (user.email === 'admin@cakeshop.com') {
      const isValid = await bcrypt.compare('admin123', user.password);
      console.log(`✅ Password 'admin123' valid: ${isValid}`);
    }
    if (user.email === 'customer@example.com') {
      const isValid = await bcrypt.compare('customer123', user.password);
      console.log(`✅ Password 'customer123' valid: ${isValid}`);
    }
    console.log('---');
  }

  await prisma.$disconnect();
}

testAuth().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
