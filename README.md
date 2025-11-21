# 🍰 Cake Shop - Full-Stack E-Commerce ApplicationThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



# 🎂 Cake Shop - Modern E-Commerce Platform

A full-stack e-commerce platform for a bakery/cake shop built with Next.js 15, TypeScript, Prisma, and Material-UI. Features include product catalog, shopping cart, checkout, admin dashboard, custom orders, and M-Pesa integration.

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse cakes by category with advanced filtering
- 🛒 **Shopping Cart** - Real-time cart with volume discounts (3+, 5+, 10+ items)
- 💳 **Secure Checkout** - Multi-step checkout with M-Pesa payment integration
- 🎨 **Custom Orders** - Request custom cakes with design specifications
- ⭐ **Reviews & Ratings** - Product reviews and ratings system
- 👤 **User Profiles** - Profile management with image upload
- ❤️ **Favorites** - Save favorite products for later
- 🌓 **Dark Mode** - Beautiful dark navy theme with gold accents
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop

### Admin Features
- 📊 **Analytics Dashboard** - Real-time sales, orders, and customer metrics
- 🎂 **Cake Management** - Full CRUD for products with image upload
- 📦 **Order Management** - Track and manage orders with status updates
- 👥 **Customer Management** - View customer information and order history
- 🎟️ **Promo Codes** - Create and manage discount codes
- 📧 **Message Center** - Handle customer inquiries with reply system
- 🛠️ **Custom Order Management** - Review and quote custom cake requests
- 👨‍💼 **Team Members** - Manage team profiles for About page
- ⚙️ **Settings** - Configure store settings and information

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Material-UI v7, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **Email**: Nodemailer (SMTP)
- **Payments**: M-Pesa Daraja API integration
- **State Management**: Zustand
- **Form Handling**: Formik, React Hook Form
- **Validation**: Yup, Zod
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Gmail account (for SMTP) or other email provider
- M-Pesa credentials (optional, for live payments)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cake-shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- SMTP credentials for email
- M-Pesa credentials (optional)

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
cake-shop/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Migration history
├── public/
│   └── images/                # Uploaded images
│       ├── team/              # Team member photos
│       └── users/             # User profile photos
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pages
│   │   ├── (auth)/            # Auth pages (login/register)
│   │   └── ...                # Customer pages
│   ├── components/            # Reusable components
│   │   ├── layout/            # Layout components
│   │   ├── admin/             # Admin components
│   │   └── ...
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── email.ts           # Email utilities
│   │   ├── mpesa.ts           # M-Pesa integration
│   │   └── utils.ts           # Helper functions
│   ├── store/                 # Zustand stores
│   ├── theme/                 # Theme configuration
│   └── types/                 # TypeScript types
├── DEPLOYMENT.md              # Deployment guide
├── .env.example               # Environment variables template
└── package.json
```

## 🎨 Key Features Explained

### Volume Discounts
Automatic discounts applied based on quantity:
- 3-4 items: 5% off
- 5-9 items: 10% off
- 10+ items: 15% off

### Custom Orders
Customers can request custom cakes by providing:
- Event type and date
- Number of servings
- Budget range
- Design preferences (flavors, colors, theme)
- Reference images
- Special requests

Admins can review, quote, and manage custom orders through the admin panel.

### M-Pesa Integration
Two payment methods supported:
1. **Manual Paybill** - Customer pays via M-Pesa Paybill
2. **STK Push** - Automated payment prompt (requires API setup)

### Image Upload
Local file upload system for:
- Team member photos
- User profile pictures
- Product images (admin)

Files are stored in `/public/images/` with size limits and type validation.

### Theme System
- **Light Mode**: Fresh light green palette – primary `#6FD694`, supporting accent `#3DAA5E`, soft mint surfaces (`#F6FFF7`) and crisp dark text for accessibility.
- **Dark Mode**: Vibrant pink primary `#D81B60` (light `#EC407A`, dark `#880E4F`) on near-black surfaces (`#0A0A0B` / `#121314`) with subtle gradient highlights.
- Component overrides unify elevation, hover gradients, rounded geometry (8px / 16px) and accessible focus states.
- Theme preference (light/dark) is persisted via `localStorage` and switchable globally from the header & admin bar.

## 🔐 Default Credentials

After seeding the database:

**Admin Account**
- Email: `admin@cakeshop.com`
- Password: `admin123`

**Customer Account**
- Email: `customer@example.com`
- Password: `customer123`

**⚠️ Change these credentials immediately in production!**

## 📊 Database Models

Key models include:
- **User** - Authentication and profiles
- **Cake** - Product catalog
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Order line items
- **CustomOrder** - Custom cake requests
- **PromoCode** - Discount codes
- **Review** - Product reviews
- **Message** - Customer inquiries
- **TeamMember** - About page team profiles

See `prisma/schema.prisma` for full schema.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Database setup (Railway, Supabase)
- Environment configuration
- Vercel deployment
- Email setup
- M-Pesa configuration
- Production checklist

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run type-check   # Run TypeScript type checking
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI for the component library
- Prisma for the excellent ORM
- Next.js team for the amazing framework
- All open-source contributors

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review the code documentation

---

**Built with ❤️ and 🎂**## Getting Started



![Next.js](https://img.shields.io/badge/Next.js-16.0-black)First, run the development server:

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)```bash

![MUI](https://img.shields.io/badge/MUI-7.3-blue)npm run dev

# or

## ✨ Featuresyarn dev

# or

### 🛍️ Customer Featurespnpm dev

- **Browse Cakes**: Search, filter by category, and sort cakes# or

- **Cake Customization**: Select size, flavor, layers, and add custom messagesbun dev

- **Shopping Cart**: Add items, update quantities, view totals```

- **Secure Checkout**: Multi-step checkout with delivery details

- **M-Pesa Payment**: Integrated STK Push payment systemOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **User Authentication**: Secure login and registration

- **Responsive Design**: Works perfectly on all devicesYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



### 👨‍💼 Admin FeaturesThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Analytics Dashboard**: Sales trends, revenue charts with Recharts

- **Order Management**: View and update order statuses## Learn More

- **Stats Overview**: Total revenue, orders, customers, and cakes

- **Visual Reports**: Line charts, pie charts, and bar chartsTo learn more about Next.js, take a look at the following resources:



## 🚀 Tech Stack- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **Frontend**: Next.js 14, TypeScript, Material-UI v7, Framer Motion

- **Forms**: Formik + Yup validationYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- **State**: Zustand (cart with localStorage)

- **Backend**: PostgreSQL + Prisma ORM## Deploy on Vercel

- **Auth**: NextAuth.js with JWT

- **Payments**: M-Pesa Daraja APIThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- **Email**: Nodemailer

- **Charts**: RechartsCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- **Date**: Day.js + MUI Date Pickers

## 🏁 Quick Start (5 Minutes)

### 1. Install Dependencies
\`\`\`bash
cd /home/nick/projects/cake-shop
npm install
\`\`\`

### 2. Setup Environment
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\`:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/cake_shop"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
\`\`\`

### 3. Setup Database
\`\`\`bash
npx prisma generate
npx prisma migrate dev --name init
npm install -D ts-node
npx prisma db seed
\`\`\`

### 4. Start Development
\`\`\`bash
npm run dev
\`\`\`

Visit: **http://localhost:3000**

### 5. Login
\`\`\`
Admin: admin@cakeshop.com / admin123
Customer: customer@example.com / customer123
\`\`\`

## 📁 Project Structure

\`\`\`
cake-shop/
├── prisma/
│   ├── schema.prisma      # Database schema (11 models)
│   └── seed.ts            # Seed data with sample cakes
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin dashboard with Recharts
│   │   ├── cakes/        # Cake listing & detail
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # 3-step checkout with M-Pesa
│   │   ├── login/        # Authentication
│   │   └── page.tsx      # Homepage
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities (auth, email, mpesa, prisma)
│   ├── store/            # Zustand cart store
│   ├── theme/            # MUI custom theme (pink/purple)
│   └── types/            # TypeScript types
├── QUICKSTART.md         # 5-minute setup guide
├── SETUP_GUIDE.md        # Detailed setup instructions
└── PROJECT_STATUS.md     # Current status & roadmap
\`\`\`

## 🎯 Key Features

### M-Pesa Integration
- STK Push payment
- Callback handling
- Transaction verification
- Sandbox & production support

### Shopping Cart
- Zustand state management
- localStorage persistence
- Guest cart support
- Real-time price calculation

### Admin Dashboard
- Revenue & order stats
- Sales trend line chart (6 months)
- Category distribution pie chart
- Top cakes bar chart

### Database
11 Prisma models:
- User, Cake, Category, Order, OrderItem
- CartItem, Review, Favorite, Address
- PromoCode, Setting

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed guide
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Status & roadmap

## 🔧 Scripts

\`\`\`bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npx prisma studio # View database
npx prisma db seed # Seed database
\`\`\`

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Railway
\`\`\`bash
railway login
railway init
railway up
\`\`\`

## 🗺️ Roadmap

### ✅ Completed (MVP)
- Database schema & migrations
- Authentication (NextAuth.js)
- Homepage with animations
- Cake listing with filters
- Cake detail with customization
- Shopping cart
- Checkout with M-Pesa
- Admin dashboard with charts
- Email notifications

### 🚧 In Progress
- Admin cake management UI
- Admin order management
- Customer order history

### 📋 Planned
- Reviews submission form
- Favorites page
- Custom cake builder
- Image upload (Cloudinary)
- Promo codes UI
- About & Contact pages

## 📝 API Endpoints

### Authentication
- \`POST /api/auth/register\`
- \`POST /api/auth/[...nextauth]\`

### Cakes
- \`GET /api/cakes\` - List with filters
- \`GET /api/cakes/[id]\` - Single cake
- \`POST /api/cakes\` - Create (admin)
- \`PUT /api/cakes/[id]\` - Update (admin)
- \`DELETE /api/cakes/[id]\` - Delete (admin)

### Orders
- \`GET /api/orders\` - List orders
- \`POST /api/orders\` - Create order + M-Pesa

### M-Pesa
- \`POST /api/mpesa/callback\` - Payment callback

## 🐛 Troubleshooting

### Database Connection Failed
\`\`\`bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
npx prisma db pull
\`\`\`

### M-Pesa Not Working
1. Verify credentials in \`.env\`
2. Use sandbox environment first
3. Test number: 254708374149

### TypeScript Errors
\`\`\`bash
npx prisma generate
npm run build
\`\`\`

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT tokens for sessions
- Environment variables for secrets
- SQL injection prevention (Prisma)
- XSS protection (Next.js)

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ by Nick

---

**Ready to get started? Check [QUICKSTART.md](./QUICKSTART.md)!** 🍰✨
