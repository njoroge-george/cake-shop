const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  });
  console.log('Users in database:');
  console.table(users);
  await prisma.$disconnect();
}

checkUsers().catch(console.error);
