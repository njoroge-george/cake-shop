const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCakes() {
  const cakes = await prisma.cake.findMany({
    select: { 
      id: true, 
      name: true, 
      slug: true,
      basePrice: true 
    }
  });
  
  console.log('🍰 Cakes in database:\n');
  cakes.forEach(cake => {
    console.log(`ID: ${cake.id}`);
    console.log(`Name: ${cake.name}`);
    console.log(`Slug: ${cake.slug}`);
    console.log(`Price: ${cake.basePrice}`);
    console.log('---');
  });
  
  await prisma.$disconnect();
}

checkCakes().catch(console.error);
