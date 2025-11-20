# 🎂 Cake Shop - Complete Setup Guide

## Project Overview

A full-stack Next.js e-commerce application for selling cakes with:
- ✅ Material-UI (MUI) for UI components
- ✅ TypeScript for type safety
- ✅ PostgreSQL with Prisma ORM
- ✅ Framer Motion for animations
- ✅ Formik for form handling
- ✅ Recharts for analytics
- ✅ Nodemailer for emails
- ✅ M-Pesa payment integration
- ✅ NextAuth.js authentication
- ✅ Zustand for state management

## ✅ What's Been Created

### Database & Backend
- ✅ Prisma schema with 11 models (User, Cake, Order, Category, Review, etc.)
- ✅ Prisma client setup
- ✅ NextAuth authentication with credentials provider
- ✅ M-Pesa Daraja API integration (STK Push, callback handler)
- ✅ Nodemailer email service with templates
- ✅ API routes for: auth, cakes, orders, M-Pesa callbacks

### Frontend
- ✅ MUI theme with pink/purple color scheme
- ✅ Providers (SessionProvider, ThemeProvider)
- ✅ Header component with cart, auth, navigation
- ✅ Homepage with hero section, categories, features
- ✅ Zustand cart store with persistence
- ✅ TypeScript types for all models
- ✅ Framer Motion animations

### Configuration
- ✅ Environment variables template
- ✅ TypeScript configuration
- ✅ Next.js configuration
- ✅ Setup script

## 🚀 Quick Start

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE cakeshop;
CREATE USER cakeadmin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cakeshop TO cakeadmin;
\q

# Update .env
DATABASE_URL="postgresql://cakeadmin:your_password@localhost:5432/cakeshop?schema=public"
```

**Option B: Neon (Serverless Postgres - Recommended)**
1. Visit [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string to `.env`

**Option C: Supabase**
1. Visit [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings > Database
4. Update `.env`

### 2. Run Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Create Seed File (Optional)

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
      phone: '254712345678',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'birthday' },
      update: {},
      create: {
        name: 'Birthday Cakes',
        slug: 'birthday',
        description: 'Delicious cakes for birthday celebrations',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wedding' },
      update: {},
      create: {
        name: 'Wedding Cakes',
        slug: 'wedding',
        description: 'Elegant cakes for your special day',
      },
    }),
  ]);

  // Create sample cakes
  await prisma.cake.create({
    data: {
      name: 'Chocolate Delight',
      slug: 'chocolate-delight',
      description: 'Rich chocolate cake with chocolate ganache',
      basePrice: 2500,
      categoryId: categories[0].id,
      flavors: ['Chocolate', 'Dark Chocolate', 'Chocolate Hazelnut'],
      sizes: [
        { name: 'Small', price: 2500, serves: 10 },
        { name: 'Medium', price: 4000, serves: 20 },
        { name: 'Large', price: 6000, serves: 30 },
      ],
      layers: [
        { name: 'Single Layer', price: 0 },
        { name: 'Double Layer', price: 500 },
        { name: 'Triple Layer', price: 1000 },
      ],
      images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587'],
      featured: true,
      inStock: true,
      stock: 10,
      tags: ['chocolate', 'popular', 'birthday'],
    },
  });

  console.log('✅ Database seeded successfully!');
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

Update `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Install ts-node:
```bash
npm install -D ts-node
```

Run seed:
```bash
npx prisma db seed
```

### 4. M-Pesa Setup

1. **Get Credentials:**
   - Visit [Safaricom Daraja](https://developer.safaricom.co.ke/)
   - Register and create an app
   - Get Consumer Key & Secret
   - For sandbox: Use shortcode `174379`

2. **Update .env:**
```env
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"
MPESA_SHORTCODE="174379"
MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
MPESA_ENVIRONMENT="sandbox"
```

3. **Test M-Pesa:**
   - Use test phone: `254708374149`
   - Test amount: Any amount (sandbox)

### 5. Email Setup (Gmail)

1. **Enable 2FA** on Google Account
2. **Generate App Password:**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Create password for "Mail"
3. **Update .env:**
```env
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="generated-app-password"
```

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy output to `.env`:
```env
NEXTAUTH_SECRET="generated-secret-here"
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 What's Still Needed

### Pages to Create

1. **Shop Pages:**
   - `/cakes` - Cakes listing page
   - `/cakes/[id]` - Cake detail page
   - `/cart` - Shopping cart
   - `/checkout` - Checkout process
   - `/custom-order` - Custom cake builder
   - `/orders` - Order history
   - `/favorites` - Wishlist

2. **Auth Pages:**
   - `/login` - Login page
   - `/register` - Registration page

3. **Customer Pages:**
   - `/dashboard` - Customer dashboard
   - `/profile` - Profile management
   - `/addresses` - Address management

4. **Admin Pages:**
   - `/admin` - Admin dashboard
   - `/admin/cakes` - Manage cakes
   - `/admin/orders` - Manage orders
   - `/admin/customers` - Customer list
   - `/admin/analytics` - Sales analytics
   - `/admin/promo-codes` - Promo codes

### Components to Create

1. **Cake Components:**
   - CakeCard
   - CakeGrid
   - CakeFilters
   - CakeImageGallery

2. **Cart Components:**
   - CartItem
   - CartSummary
   - CartDrawer

3. **Form Components:**
   - LoginForm (with Formik)
   - RegisterForm
   - CheckoutForm
   - CakeForm (admin)

4. **Admin Components:**
   - AdminSidebar
   - StatsCards
   - SalesChart (Recharts)
   - OrdersTable

## 🎨 Customization

### Change Theme Colors

Edit `src/theme/theme.ts`:

```typescript
primary: {
  main: '#YOUR_COLOR',
},
secondary: {
  main: '#YOUR_COLOR',
}
```

### Add More Email Templates

Edit `src/lib/email.ts` and add new functions.

### Modify Database Schema

1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name your_change_name`
3. Run: `npx prisma generate`

## 🛠 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma db push       # Push schema without migration
npx prisma db seed       # Seed database

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

## 📊 Database Schema Overview

### Core Models:
- **User** - Customers and admins
- **Cake** - Cake products with sizes, flavors, layers
- **Category** - Cake categories
- **Order** - Customer orders
- **OrderItem** - Items in orders
- **CartItem** - Shopping cart items
- **Address** - Delivery addresses
- **Review** - Customer reviews
- **Favorite** - Wishlist
- **PromoCode** - Discount codes
- **Session/Account** - NextAuth tables

## 🚀 Deployment Checklist

### Before Deploying:

1. ✅ Set up production database (Neon/Supabase/Railway)
2. ✅ Add all environment variables to deployment platform
3. ✅ Update `NEXTAUTH_URL` to production domain
4. ✅ Update `MPESA_CALLBACK_URL` to production URL
5. ✅ Switch M-Pesa to production environment
6. ✅ Test email sending
7. ✅ Run build: `npm run build`

### Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Follow prompts and add environment variables in Vercel dashboard.

## 📝 Next Steps

1. **Create remaining pages** (see list above)
2. **Test M-Pesa integration** with sandbox
3. **Add image upload** (Cloudinary or AWS S3)
4. **Implement search** functionality
5. **Add filters** to cakes page
6. **Create admin dashboard** with charts
7. **Add order tracking** system
8. **Implement notifications** (email/SMS)
9. **Add reviews** system
10. **Create mobile app** (React Native/Expo)

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Try: `npx prisma migrate reset`

### M-Pesa Not Working
- Verify credentials in .env
- Check you're using sandbox for testing
- Ensure callback URL is accessible

### Email Not Sending
- Check SMTP credentials
- Verify app password (not regular password)
- Check firewall/port 587

### Build Errors
- Run: `npm run lint`
- Check TypeScript errors: `npx tsc --noEmit`
- Clear cache: `rm -rf .next`

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [MUI Docs](https://mui.com/)
- [M-Pesa Daraja](https://developer.safaricom.co.ke/)
- [NextAuth Docs](https://next-auth.js.org/)

---

Need help? Check the documentation or create an issue!

Happy baking! 🎂
