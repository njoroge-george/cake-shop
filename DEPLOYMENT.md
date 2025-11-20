# Deployment Guide

This guide covers deploying the Cake Shop application to production.

## Prerequisites

- PostgreSQL database (Railway, Supabase, or other PostgreSQL provider)
- Node.js 18+ installed locally
- Git repository set up
- Vercel account (recommended) or other hosting platform

## Environment Variables

Create a `.env` file based on `.env.example`. You'll need:

### Required Variables

```bash
# Database - Get from your PostgreSQL provider
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://your-domain.com"

# Email (Gmail SMTP recommended for testing)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
EMAIL_FROM="Cake Shop <noreply@your-domain.com>"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_DELIVERY_FEE="500"
```

### Optional Variables (M-Pesa Integration)

```bash
MPESA_CONSUMER_KEY="your-safaricom-consumer-key"
MPESA_CONSUMER_SECRET="your-safaricom-consumer-secret"
MPESA_SHORTCODE="your-business-shortcode"
MPESA_PASSKEY="your-passkey"
MPESA_CALLBACK_URL="https://your-domain.com/api/mpesa/callback"
MPESA_ENVIRONMENT="production"
```

## Deployment Steps

### 1. Database Setup

#### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the `DATABASE_URL` from the Connect tab
4. Add to your environment variables

#### Option B: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the connection string (Session mode recommended)
5. Add to your environment variables

### 2. Run Database Migrations

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with initial data
npx prisma db seed
```

### 3. Deploy to Vercel

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add all environment variables from your `.env` file
5. Deploy

### 4. Deploy to Hostinger

Hostinger gives you two viable paths for this project: the managed **Next.js hosting (hPanel)** or a **VPS/Cloud server** where you control Node.js entirely. Both approaches assume you already have a PostgreSQL instance (Hostinger Managed DB, or an external provider like Railway, Supabase, Neon, etc.) because shared MySQL will not work with Prisma.

#### 4.1 Prep work (applies to both options)

1. **Push code to a Git provider** (GitHub, GitLab, Bitbucket). Hostinger pulls straight from Git.
2. **Create `.env.production`** locally with all required variables (`DATABASE_URL`, `NEXTAUTH_*`, `SMTP_*`, `CLOUDINARY_*`, `NEXT_PUBLIC_*`, `MPESA_*`). Commit the template if needed, but never commit secrets.
3. **Verify migrations locally** with the same database version you will use remotely: `npm run db:migrate && npm run db:seed`.
4. **Decide on file uploads**. Hostinger's managed Next.js file system is read-only after each deploy, so configure the bundled Cloudinary integration (`CLOUDINARY_*` env vars) to persist images instead of relying on `/public/images`.

#### 4.2 Hostinger Next.js hosting (hPanel)

1. **Create the project**: hPanel → Websites → Manage → Next.js → *Create application*. Choose the Git repo/branch and set the project root (empty string if the repo root is the Next.js app).
2. **Runtime settings**:
   - Node.js version: 20 (Next 16 requires ≥18).
   - Install command: `npm ci` (faster/cleaner for CI). Hostinger runs `npm install` by default; override if you prefer.
   - Build command (ensures Prisma client + migrations before build):
     ```bash
     npm ci && npm run db:generate && npm run db:migrate && npm run build
     ```
   - Start command:
     ```bash
     npm run start -- --hostname 0.0.0.0 --port $PORT
     ```
     Hostinger injects `$PORT`; binding to `0.0.0.0` allows the reverse proxy to connect.
3. **Environment variables**: hPanel → Next.js → Environment. Paste every key from `.env.production`. Make sure `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` reference your Hostinger domain.
4. **Database access**:
   - If you use Hostinger Managed PostgreSQL, allow the deployment IP in the DB firewall and copy the connection string into `DATABASE_URL`.
   - If you use an external DB, whitelist Hostinger's outbound IPs or use a public managed DB (Neon/Railway/Supabase) that allows password auth over TLS.
5. **Seed data**: Hostinger builds are non-interactive, so run `npm run db:seed` via the built-in Web Terminal/SSH once the deployment finishes, or temporarily append it to the build command (only for the first deploy).
6. **Repeat deployments** happen automatically on git push. Prisma migrations run each time because they are part of the build command; they are idempotent.

#### 4.3 Hostinger VPS / Cloud server

1. **Provision the VPS** (Ubuntu 22.04+ recommended) and point your domain to its IP (A record). Enable SSH access.
2. **Install dependencies**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs build-essential nginx postgresql-client
   sudo npm install -g pm2
   ```
3. **Clone and configure the app**:
   ```bash
   git clone <repo-url> /var/www/cake-shop
   cd /var/www/cake-shop
   npm ci
   cp .env.example .env.production   # then edit with production secrets
   ```
4. **Prisma + database** (point `DATABASE_URL` at your managed Postgres):
   ```bash
   npm run db:generate
   npm run db:migrate       # prisma migrate deploy
   npm run db:seed          # optional but recommended
   npm run build
   ```
5. **Process manager (PM2)**: create `ecosystem.config.js` (or use inline command).

   ```js
   module.exports = {
     apps: [
       {
         name: "cake-shop",
         script: "npm",
         args: "run start -- --hostname 0.0.0.0 --port 3000",
         cwd: "/var/www/cake-shop",
         env: {
           NODE_ENV: "production",
           PORT: "3000",
           NEXTAUTH_URL: "https://cakes.example.com",
           // ...copy the rest of your env vars here
         }
       }
     ]
   };
   ```

   Start and persist:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup systemd   # follow the printed instructions once
   ```
6. **Reverse proxy + SSL with Nginx**:
   - Create `/etc/nginx/sites-available/cake-shop`:
     ```nginx
     server {
       server_name cakes.example.com;

       location / {
         proxy_pass http://127.0.0.1:3000;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
       }
     }
     ```
   - Enable it (`ln -s /etc/nginx/sites-available/cake-shop /etc/nginx/sites-enabled/`), test (`sudo nginx -t`), reload (`sudo systemctl reload nginx`).
   - Issue SSL: `sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d cakes.example.com`.
7. **Uploads**: ensure any local upload directories (if you keep `public/images/...`) are writable by the Node user (`sudo chown -R www-data:www-data public/images`). Prefer Cloudinary for durability.
8. **Monitoring**: `pm2 logs cake-shop`, `pm2 restart cake-shop`, schedule backups for `.env.production` and your database.

### 5. Post-Deployment Setup

#### Create Admin User

After deployment, create an admin account:

```bash
# Connect to your production database
npx prisma studio --browser none

# Or use SQL directly
UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin-email@example.com';
```

#### Upload Team Images

1. Login as admin
2. Go to `/admin/team-members`
3. Upload team member images (400x400px recommended)

#### Configure Settings

1. Login as admin
2. Go to `/admin/settings`
3. Configure:
   - Store name
   - Contact information
   - Social media links
   - Business hours

### 6. Email Setup (Gmail)

To use Gmail SMTP:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password
3. Use this password as `SMTP_PASSWORD`

### 7. M-Pesa Integration (Optional)

For live M-Pesa payments:

1. Register for Safaricom Daraja API
2. Create a production app
3. Get your credentials:
   - Consumer Key
   - Consumer Secret
   - Shortcode (Paybill number)
   - Passkey
4. Register your callback URL: `https://your-domain.com/api/mpesa/callback`
5. Add all M-Pesa variables to environment

### 8. Custom Domain (Optional)

#### On Vercel:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your custom domain

## Production Checklist

- [ ] Database is set up and migrations are run
- [ ] All environment variables are configured
- [ ] Admin user is created
- [ ] Email sending is working (test with contact form)
- [ ] Images directory is writable (`/public/images`)
- [ ] Team members are added with images
- [ ] Store settings are configured
- [ ] Test complete order flow
- [ ] Test custom order submission
- [ ] Verify admin dashboard loads correctly
- [ ] Check mobile responsiveness
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure analytics (Google Analytics, Vercel Analytics)

## Monitoring & Maintenance

### Check Application Health

```bash
# View application logs
vercel logs

# Check database
npx prisma studio
```

### Regular Maintenance

- Monitor disk space for uploaded images
- Check database performance
- Review error logs weekly
- Update dependencies monthly: `npm update`
- Backup database regularly

### Performance Optimization

1. **Image Optimization**
   - Compress uploaded images
   - Use WebP format when possible
   - Set max upload size (currently 5MB)

2. **Database Optimization**
   - Add indexes for frequently queried fields
   - Archive old orders (6+ months)
   - Monitor query performance

3. **Caching**
   - Enable Vercel Edge Caching
   - Use ISR (Incremental Static Regeneration) for product pages
   - Cache API responses where appropriate

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull
```

If fails, check:
- `DATABASE_URL` is correct
- Database is accessible from deployment region
- Connection pooling is enabled

### Email Not Sending

- Verify Gmail App Password is correct
- Check SMTP credentials
- Review email logs in admin panel
- Test with a simple email client

### Images Not Uploading

- Check `/public/images` directory exists
- Verify write permissions
- Check file size limit (5MB)
- Review file type restrictions

### M-Pesa Callback Not Working

- Verify callback URL is registered with Safaricom
- Check callback URL is publicly accessible
- Review M-Pesa logs in admin dashboard
- Test with Safaricom's test environment first

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to Git
   - Rotate secrets regularly
   - Use different secrets for staging/production

2. **Database**
   - Enable SSL connections
   - Restrict database access by IP
   - Regular backups
   - Monitor for suspicious activity

3. **Application**
   - Keep dependencies updated
   - Enable rate limiting on API routes
   - Validate all user inputs
   - Use HTTPS only

4. **User Data**
   - Hash passwords with bcrypt
   - Secure session tokens
   - Implement GDPR compliance
   - Regular security audits

## Scaling Considerations

As your business grows:

1. **Database**
   - Upgrade to larger instance
   - Enable connection pooling
   - Consider read replicas

2. **File Storage**
   - Move to cloud storage (AWS S3, Cloudinary)
   - Implement CDN for images
   - Set up automatic backups

3. **Application**
   - Enable Vercel Pro for better performance
   - Implement caching strategy
   - Consider serverless functions for heavy tasks

## Support

For issues or questions:
- Check logs: `vercel logs`
- Review Prisma docs: [prisma.io/docs](https://prisma.io/docs)
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel support: [vercel.com/support](https://vercel.com/support)

## Backup & Disaster Recovery

### Database Backups

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Image Backups

Regularly backup `/public/images` directory to external storage.

### Recovery Plan

1. Keep copy of `.env` in secure location
2. Document all third-party integrations
3. Test recovery process quarterly
4. Maintain staging environment for testing

---

**Last Updated:** November 2025
