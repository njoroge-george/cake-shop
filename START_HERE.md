# 🎯 START HERE - Cake Shop Quick Reference

## 🚀 First Time Setup (Run These Commands)

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and add your database URL
nano .env  # or use your favorite editor

# Minimum required in .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/cake_shop"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# 4. Setup database
npx prisma generate
npx prisma migrate dev --name init

# 5. Install dev dependency for seeding
npm install -D ts-node

# 6. Seed database with sample data
npx prisma db seed

# 7. Start development server
npm run dev
\`\`\`

## ✅ After Setup

Visit: http://localhost:3000

**Login Credentials:**
- Admin: admin@cakeshop.com / admin123
- Customer: customer@example.com / customer123

## 📂 Important Files

- \`README.md\` - Full project documentation
- \`QUICKSTART.md\` - Detailed 5-minute setup guide
- \`SETUP_GUIDE.md\` - Database, M-Pesa, Email setup
- \`PROJECT_STATUS.md\` - What's done, what's next
- \`.env.example\` - All environment variables explained
- \`prisma/schema.prisma\` - Database schema
- \`prisma/seed.ts\` - Sample data (6 cakes, 2 users, 3 categories)

## 🎨 What's Built

### Pages ✅
- Homepage with hero, features, categories
- Cake listing (search, filters, pagination)
- Cake detail (customization, add to cart)
- Shopping cart
- Checkout (3 steps with M-Pesa)
- Login / Register
- Admin dashboard (charts with Recharts)

### Features ✅
- User authentication (NextAuth.js)
- Shopping cart (Zustand + localStorage)
- M-Pesa payment integration
- Email notifications (Nodemailer)
- Responsive design (Material-UI)
- Animations (Framer Motion)
- Form validation (Formik + Yup)

## 🔧 Common Commands

\`\`\`bash
npm run dev           # Start dev server
npm run build         # Build for production
npm start            # Start production server

npx prisma studio    # View database in browser
npx prisma db seed   # Re-seed database
npx prisma migrate dev --name <name>  # Create new migration

# View all cakes in database
npx prisma studio
# Then navigate to "Cake" table
\`\`\`

## 🌐 Routes

**Public:**
- / - Homepage
- /cakes - Browse all cakes
- /cakes/[id] - Cake detail
- /login - Login page
- /register - Register page

**Protected (Login Required):**
- /cart - Shopping cart
- /checkout - Checkout flow
- /admin - Admin dashboard (admin role only)

**API:**
- /api/auth/* - Authentication
- /api/cakes - Cake CRUD
- /api/orders - Order management
- /api/mpesa/callback - M-Pesa webhook

## 🎯 Quick Test Flow

1. **Browse cakes:** Go to http://localhost:3000/cakes
2. **View details:** Click any cake
3. **Customize:** Select size, flavor, layers
4. **Add to cart:** Click "Add to Cart"
5. **View cart:** Click cart icon in header
6. **Register:** Create account at /register
7. **Checkout:** Fill delivery details
8. **Admin:** Login as admin, visit /admin

## 🐛 Troubleshooting

**Error: Can't connect to database**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Try: \`npx prisma db pull\`

**Error: Prisma Client not generated**
\`\`\`bash
npx prisma generate
\`\`\`

**Error: TypeScript errors**
- Make sure all dependencies installed: \`npm install\`
- Regenerate Prisma: \`npx prisma generate\`
- Check .env has all required variables

**Port 3000 already in use**
\`\`\`bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
\`\`\`

## 📚 Next Steps

1. **Setup M-Pesa** (optional for testing):
   - Register at https://developer.safaricom.co.ke
   - Get sandbox credentials
   - Update .env with MPESA_* variables
   - See SETUP_GUIDE.md for details

2. **Setup Email** (optional for testing):
   - Create Gmail app password
   - Update .env SMTP_* variables
   - See SETUP_GUIDE.md for details

3. **Add more cakes**:
   - Login as admin
   - Open Prisma Studio: \`npx prisma studio\`
   - Add cakes in "Cake" table

4. **Deploy to production**:
   - See README.md deployment section
   - Recommended: Vercel + Neon (PostgreSQL)

## 🎉 You're All Set!

The app is fully functional and ready to use. Check README.md for complete documentation.

**Need help?** Read QUICKSTART.md or SETUP_GUIDE.md

Happy coding! 🍰✨
