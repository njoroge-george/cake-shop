import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cakeshop.com' },
    update: {},
    create: {
      email: 'admin@cakeshop.com',
      name: 'Admin User',
      phone: '254712345678',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const birthdayCategory = await prisma.category.upsert({
    where: { slug: 'birthday' },
    update: {},
    create: {
      name: 'Birthday Cakes',
      slug: 'birthday',
      description: 'Celebrate your special day with our delicious birthday cakes',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500',
    },
  });

  const weddingCategory = await prisma.category.upsert({
    where: { slug: 'wedding' },
    update: {},
    create: {
      name: 'Wedding Cakes',
      slug: 'wedding',
      description: 'Elegant wedding cakes for your special day',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500',
    },
  });

  const customCategory = await prisma.category.upsert({
    where: { slug: 'custom' },
    update: {},
    create: {
      name: 'Custom Cakes',
      slug: 'custom',
      description: 'Design your own unique cake',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500',
    },
  });

  console.log('✅ Categories created');

  // Create sample cakes
  const cakes = [
    {
      name: 'Chocolate Delight',
      slug: 'chocolate-delight',
      description: 'Rich chocolate cake with smooth ganache and chocolate shavings. Perfect for chocolate lovers!',
      categoryId: birthdayCategory.id,
      basePrice: 2500,
      images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
        'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800',
      ],
      sizes: [
        { name: 'Small (6")', serves: 6, price: 0 },
        { name: 'Medium (8")', serves: 12, price: 1000 },
        { name: 'Large (10")', serves: 20, price: 2500 },
      ],
      flavors: ['Chocolate', 'Dark Chocolate', 'White Chocolate'],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 500 },
        { name: 'Triple Layer', price: 1000 },
      ],
      featured: true,
      inStock: true,
      tags: ['chocolate', 'birthday', 'popular'],
    },
    {
      name: 'Vanilla Dream',
      slug: 'vanilla-dream',
      description: 'Classic vanilla sponge cake with buttercream frosting. Light and fluffy!',
      categoryId: birthdayCategory.id,
      basePrice: 2000,
      images: [
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
      ],
      sizes: [
        { name: 'Small (6")', serves: 6, price: 0 },
        { name: 'Medium (8")', serves: 12, price: 800 },
        { name: 'Large (10")', serves: 20, price: 2000 },
      ],
      flavors: ['Vanilla', 'French Vanilla', 'Vanilla Bean'],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 400 },
        { name: 'Triple Layer', price: 800 },
      ],
      featured: true,
      inStock: true,
      tags: ['vanilla', 'classic', 'birthday'],
    },
    {
      name: 'Red Velvet Romance',
      slug: 'red-velvet-romance',
      description: 'Stunning red velvet cake with cream cheese frosting. A crowd favorite!',
      categoryId: weddingCategory.id,
      basePrice: 3500,
      images: [
        'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800',
      ],
      sizes: [
        { name: 'Small (6")', serves: 6, price: 0 },
        { name: 'Medium (8")', serves: 12, price: 1500 },
        { name: 'Large (10")', serves: 20, price: 3000 },
      ],
      flavors: ['Red Velvet', 'Pink Velvet', 'Blue Velvet'],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 700 },
        { name: 'Triple Layer', price: 1400 },
      ],
      featured: true,
      inStock: true,
      tags: ['red-velvet', 'wedding', 'romantic'],
    },
    {
      name: 'Lemon Zest',
      slug: 'lemon-zest',
      description: 'Fresh lemon cake with tangy lemon glaze. Perfect for summer celebrations!',
      categoryId: birthdayCategory.id,
      basePrice: 2200,
      images: [
        'https://images.unsplash.com/photo-1519869325930-281384150729?w=800',
      ],
      sizes: [
        { name: 'Small (6")', serves: 6, price: 0 },
        { name: 'Medium (8")', serves: 12, price: 1000 },
        { name: 'Large (10")', serves: 20, price: 2200 },
      ],
      flavors: ['Lemon', 'Lemon Blueberry', 'Lemon Raspberry'],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 500 },
      ],
      featured: false,
      inStock: true,
      tags: ['lemon', 'fruity', 'summer'],
    },
    {
      name: 'Carrot Cake Supreme',
      slug: 'carrot-cake-supreme',
      description: 'Moist carrot cake with cream cheese frosting and walnuts. A healthy indulgence!',
      categoryId: customCategory.id,
      basePrice: 2800,
      images: [
        'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800',
      ],
      sizes: [
        { name: 'Small (6")', serves: 6, price: 0 },
        { name: 'Medium (8")', serves: 12, price: 1200 },
        { name: 'Large (10")', serves: 20, price: 2500 },
      ],
      flavors: ['Classic Carrot', 'Spiced Carrot', 'Carrot Pineapple'],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 600 },
        { name: 'Triple Layer', price: 1200 },
      ],
      featured: false,
      inStock: true,
      tags: ['carrot', 'healthy', 'nuts'],
    },
    {
      name: 'Tiered Wedding Elegance',
      slug: 'tiered-wedding-elegance',
      description: 'Three-tiered wedding cake with white fondant and edible flowers. Absolutely stunning!',
      categoryId: weddingCategory.id,
      basePrice: 15000,
      images: [
        'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800',
      ],
      sizes: [
        { name: 'Three Tiers', serves: 50, price: 0 },
        { name: 'Four Tiers', serves: 75, price: 5000 },
        { name: 'Five Tiers', serves: 100, price: 10000 },
      ],
      flavors: ['Vanilla', 'Chocolate', 'Red Velvet', 'Lemon'],
      layers: [
        { name: 'Standard', price: 0 },
        { name: 'Premium Filling', price: 2000 },
      ],
      featured: true,
      inStock: true,
      tags: ['wedding', 'tiered', 'elegant', 'premium'],
    },
  ];

  for (const cakeData of cakes) {
    await prisma.cake.upsert({
      where: { slug: cakeData.slug },
      update: {},
      create: cakeData,
    });
    console.log(`✅ Created cake: ${cakeData.name}`);
  }

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '254700123456',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create sample team members
  const teamMembers = [
    {
      name: 'Sarah Mwangi',
      role: 'Head Pastry Chef',
      bio: '15+ years of experience creating magical moments through cake artistry. Passionate about innovative designs.',
      image: null, // Add image manually via admin panel
      order: 1,
      isActive: true,
    },
    {
      name: 'David Ochieng',
      role: 'Creative Director',
      bio: 'Specializes in custom designs that bring your wildest cake dreams to life. Award-winning cake designer.',
      image: null, // Add image manually via admin panel
      order: 2,
      isActive: true,
    },
    {
      name: 'Grace Kimani',
      role: 'Operations Manager',
      bio: 'Ensures every order is perfect and delivered with a smile. Customer satisfaction is our priority.',
      image: null, // Add image manually via admin panel
      order: 3,
      isActive: true,
    },
    {
      name: 'James Wanjiru',
      role: 'Lead Decorator',
      bio: 'Master of intricate designs and edible art that wows every time. Precision and creativity combined.',
      image: null, // Add image manually via admin panel
      order: 4,
      isActive: true,
    },
  ];

  for (const member of teamMembers) {
    const existing = await prisma.$queryRaw`
      SELECT id FROM team_members WHERE name = ${member.name} LIMIT 1
    ` as any[];
    
    if (existing.length === 0) {
      await prisma.$executeRaw`
        INSERT INTO team_members (id, name, role, bio, image, "order", "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${member.name}, ${member.role}, ${member.bio}, ${member.image}, ${member.order}, ${member.isActive}, NOW(), NOW())
      `;
      console.log(`✅ Created team member: ${member.name}`);
    } else {
      console.log(`⏭️  Team member already exists: ${member.name}`);
    }
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Login Credentials:');
  console.log('Admin: admin@cakeshop.com / admin123');
  console.log('Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
