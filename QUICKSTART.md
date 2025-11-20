# 🍰 Cake Shop - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- M-Pesa developer account (for payments)
- Gmail account (for email notifications)

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd /home/nick/projects/cake-shop
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and update:
```env
# Database (Required - use Neon, Supabase, or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/cake_shop"

# NextAuth (Required - generate secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # Run: openssl rand -base64 32

# M-Pesa (Optional for testing - use sandbox credentials)
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"
MPESA_PASSKEY="your_passkey"
MPESA_SHORT_CODE="174379"  # Sandbox shortcode
MPESA_ENVIRONMENT="sandbox"

# Email (Optional - use Gmail App Password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your.email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Cake Shop <your.email@gmail.com>"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DELIVERY_FEE="500"
```

### 3. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Open Prisma Studio (optional - view database)
npx prisma studio
```

### 4. Seed Database (Optional but Recommended)
Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cakeshop.com' },
    update: {},
    create: {
      email: 'admin@cakeshop.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create category
  const category = await prisma.category.upsert({
    where: { slug: 'birthday' },
    update: {},
    create: {
      name: 'Birthday Cakes',
      slug: 'birthday',
      description: 'Delicious cakes for birthdays',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500',
    },
  });

  // Create sample cake
  await prisma.cake.upsert({
    where: { slug: 'chocolate-delight' },
    update: {},
    create: {
      name: 'Chocolate Delight',
      slug: 'chocolate-delight',
      description: 'Rich chocolate cake with smooth ganache',
      categoryId: category.id,
      basePrice: 2500,
      images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
      ],
      sizes: [
        { name: 'Small (6")', serves: 6, price: 0 },
        { name: 'Medium (8")', serves: 12, price: 1000 },
        { name: 'Large (10")', serves: 20, price: 2500 },
      ],
      flavors: ['Chocolate', 'Vanilla', 'Red Velvet'],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 500 },
        { name: 'Triple Layer', price: 1000 },
      ],
      featured: true,
      inStock: true,
      tags: ['chocolate', 'birthday', 'popular'],
    },
  });

  console.log('✅ Seed data created!');
  console.log('📧 Admin email: admin@cakeshop.com');
  console.log('🔑 Admin password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
```

Run seed:
```bash
npm install -D ts-node
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 🎯 Default Credentials (After Seeding)
- **Admin Login**: admin@cakeshop.com / admin123
- **Admin Panel**: http://localhost:3000/admin

## 📱 Test the Application

### Customer Flow:
1. Browse cakes at `/cakes`
2. View cake details and customize
3. Add to cart
4. Register/Login
5. Checkout with M-Pesa

### Admin Flow:
1. Login as admin
2. Visit `/admin` for dashboard
3. View analytics and charts

## 🔧 Known Issues & Fixes

### Issue: MUI Grid Errors
MUI v7 uses Grid2 instead of Grid. Run this to fix:
```bash
npm install @mui/material@latest
```

Or manually replace in files:
```typescript
// Change this:
import { Grid } from '@mui/material';

// To this:
import { Grid2 as Grid } from '@mui/material';

// Change props:
<Grid item xs={12} md={6}>  // Old
<Grid size={{ xs: 12, md: 6 }}>  // New
```

### Issue: Type Errors
If you see TypeScript errors, run:
```bash
npx prisma generate
npm run build
```

## 🌟 Next Steps

### Add More Cakes
1. Login as admin
2. Use Prisma Studio: `npx prisma studio`
3. Manually add cakes, or create admin CRUD page

### Configure M-Pesa
1. Visit https://developer.safaricom.co.ke
2. Create app and get sandbox credentials
3. Update `.env` with your credentials
4. Test with phone number: 254708374149 (sandbox)

### Configure Email
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env` SMTP settings

### Deploy to Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

Recommended platforms:
- **Vercel** (easiest): Automatic deployments from Git
- **Railway**: PostgreSQL + Next.js hosting
- **DigitalOcean**: VPS with Docker

## 📚 Documentation
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Project Status](./PROJECT_STATUS.md) - What's built and what's next
- [API Documentation](./docs/API.md) - API endpoints reference

## 🆘 Troubleshooting

### Database Connection Failed
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in `.env`
- Test connection: `npx prisma db pull`

### M-Pesa Not Working
- Check credentials in `.env`
- Verify you're using sandbox environment
- Test access token: Check `/api/mpesa/callback` logs

### Email Not Sending
- Verify Gmail app password (not regular password)
- Check SMTP settings
- Test with: `npm install -D @sendgrid/mail` (alternative)

## 💬 Support
Found an issue? Check:
1. Console errors in browser (F12)
2. Terminal logs where `npm run dev` is running
3. Database schema: `npx prisma studio`

## 🎉 Success Checklist
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Database seeded (`npx prisma db seed`)
- [ ] Dev server running (`npm run dev`)
- [ ] Homepage loads at http://localhost:3000
- [ ] Can login as admin
- [ ] Admin dashboard shows charts
- [ ] Can browse cakes
- [ ] Can add to cart
- [ ] Can register new user

Happy coding! 🍰✨
