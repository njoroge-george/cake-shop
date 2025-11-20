# Cake Shop - Navigation & Routing Guide

## 🗺️ How Routing Works in Next.js

In Next.js 13+ (App Router), **routing is file-based**. The folder structure in `/src/app/` directly maps to URLs:

```
src/app/
├── page.tsx              → http://localhost:3000/           (Homepage)
├── about/
│   └── page.tsx          → http://localhost:3000/about      (About page)
├── contact/
│   └── page.tsx          → http://localhost:3000/contact    (Contact page)
├── cakes/
│   ├── page.tsx          → http://localhost:3000/cakes      (All cakes)
│   └── [id]/
│       └── page.tsx      → http://localhost:3000/cakes/123  (Single cake detail)
├── cart/
│   └── page.tsx          → http://localhost:3000/cart       (Shopping cart)
├── checkout/
│   └── page.tsx          → http://localhost:3000/checkout   (Checkout)
├── login/
│   └── page.tsx          → http://localhost:3000/login      (Login)
├── register/
│   └── page.tsx          → http://localhost:3000/register   (Register)
├── dashboard/
│   └── page.tsx          → http://localhost:3000/dashboard  (User dashboard)
├── orders/
│   └── page.tsx          → http://localhost:3000/orders     (Customer orders)
├── favorites/
│   └── page.tsx          → http://localhost:3000/favorites  (Favorites)
├── profile/
│   └── page.tsx          → http://localhost:3000/profile    (User profile)
├── custom-order/
│   └── page.tsx          → http://localhost:3000/custom-order (Custom cake builder)
└── admin/
    ├── page.tsx          → http://localhost:3000/admin      (Admin dashboard)
    └── orders/
        └── page.tsx      → http://localhost:3000/admin/orders (Admin orders)
```

## 🔗 Main Navigation Component

The **Header component** (`/src/components/layout/Header.tsx`) is the main navigation that connects all pages:

### Desktop Menu Links:
- **All Cakes** → `/cakes`
- **Custom Order** → `/custom-order`
- **About** → `/about`
- **Contact** → `/contact`
- **Admin Panel** → `/admin` (only visible if logged in as ADMIN)

### User Menu (when logged in):
- **Dashboard** → `/dashboard`
- **My Orders** → `/orders`
- **Favorites** → `/favorites`
- **Profile** → `/profile`
- **Logout** → Signs out and redirects to `/`

### Quick Access:
- **Cart Icon** → `/cart`
- **Login Button** → `/login` (when not logged in)

## 📋 Complete Page Inventory

### ✅ Customer Pages (All Created):
1. **Homepage** (`/`) - Hero section, features, categories
2. **All Cakes** (`/cakes`) - Browse all available cakes with filters
3. **Cake Detail** (`/cakes/[id]`) - Single cake with customization options
4. **Cart** (`/cart`) - Shopping cart with items
5. **Checkout** (`/checkout`) - Order placement with M-Pesa integration
6. **Login** (`/login`) - User authentication
7. **Register** (`/register`) - New user registration
8. **Dashboard** (`/dashboard`) - User dashboard with quick stats
9. **Orders** (`/orders`) - Customer order history
10. **Favorites** (`/favorites`) - Saved favorite cakes
11. **Profile** (`/profile`) - User profile management
12. **About** (`/about`) - About the bakery, story, team
13. **Contact** (`/contact`) - Contact form and information
14. **Custom Order** (`/custom-order`) - Custom cake builder (coming soon)

### ✅ Admin Pages (Created):
1. **Admin Dashboard** (`/admin`) - Analytics and statistics
2. **Admin Orders** (`/admin/orders`) - Order management

### 🔨 Admin Pages (To Be Created):
3. **Admin Cakes** (`/admin/cakes`) - Cake CRUD management
4. **Admin Customers** (`/admin/customers`) - Customer management
5. **Admin Categories** (`/admin/categories`) - Category management
6. **Admin Promo Codes** (`/admin/promo-codes`) - Discount codes
7. **Admin Messages** (`/admin/messages`) - Contact form messages
8. **Admin Settings** (`/admin/settings`) - System settings

## 🎯 How to Access Pages

### For Customers:
1. Start at homepage: `http://localhost:3000/`
2. Click "Browse Cakes" or use navigation menu
3. Login to access: Dashboard, Orders, Favorites, Profile
4. Use cart icon to view shopping cart

### For Admin:
1. Login with admin credentials:
   - Email: `admin@cakeshop.com`
   - Password: `admin123`
2. Click "Admin Panel" in the header (appears after login)
3. Use sidebar navigation in admin pages:
   - Dashboard (analytics)
   - Orders (manage all orders)
   - Other sections (to be built)

## 🔐 Protected Routes

Some pages require authentication:
- `/dashboard` - Redirects to `/login` if not authenticated
- `/orders` - Redirects to `/login` if not authenticated
- `/favorites` - Redirects to `/login` if not authenticated
- `/profile` - Redirects to `/login` if not authenticated
- `/admin/*` - Requires ADMIN role
- `/checkout` - Works better when authenticated

## 🎨 Layout Components

### Header Component
- Located: `/src/components/layout/Header.tsx`
- Used by: **All pages** include `<Header />` at the top
- Features:
  - Logo (links to homepage)
  - Navigation menu
  - Cart badge with item count
  - User menu when logged in
  - Mobile responsive menu

### AdminLayout Component
- Located: `/src/components/admin/AdminLayout.tsx`
- Used by: Admin pages (`/admin/*`)
- Features:
  - Persistent sidebar navigation
  - Breadcrumb/title bar
  - User profile section
  - Mobile drawer menu

## 🚀 Testing Your Routes

Visit these URLs in your browser (with server running):

**Public Pages:**
- http://localhost:3000/ (Homepage)
- http://localhost:3000/cakes (All Cakes)
- http://localhost:3000/about (About)
- http://localhost:3000/contact (Contact)
- http://localhost:3000/login (Login)

**Authenticated Pages (Login First):**
- http://localhost:3000/dashboard (User Dashboard)
- http://localhost:3000/orders (My Orders)
- http://localhost:3000/favorites (Favorites)
- http://localhost:3000/profile (Profile)

**Admin Pages (Login as Admin):**
- http://localhost:3000/admin (Admin Dashboard)
- http://localhost:3000/admin/orders (Manage Orders)

## 📝 Notes

- All pages use the same **Header** component for consistent navigation
- Admin pages use **AdminLayout** which includes Header + Sidebar
- The homepage (`/page.tsx`) is your main landing page
- Header shows/hides items based on authentication state
- Dynamic routes like `/cakes/[id]` use Next.js dynamic routing
- All routing is handled automatically by Next.js file structure

## 🐛 Troubleshooting

**Page not found?**
1. Check that a `page.tsx` file exists in the correct folder
2. Make sure the dev server is running: `npm run dev`
3. Clear Next.js cache: `rm -rf .next && npm run dev`

**Navigation link not working?**
1. Check the Header component for the link
2. Verify the href matches the folder name in `/src/app/`
3. Links use Next.js `<Link>` component for client-side routing

**Admin page not accessible?**
1. Login with admin credentials
2. Check that session.user.role === 'ADMIN'
3. Admin Panel button only shows for admin users
