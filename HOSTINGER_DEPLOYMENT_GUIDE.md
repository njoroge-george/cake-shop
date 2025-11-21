# Complete Hostinger VPS Deployment Guide

## 🎯 Complete Step-by-Step Guide for Next.js Application Deployment

This guide will walk you through deploying a Next.js application with PostgreSQL database on a Hostinger VPS from scratch.

---

## 📋 Prerequisites

- Hostinger VPS account with root access
- Domain name (optional but recommended)
- GitHub repository with your code
- SSH client (Terminal on Mac/Linux, PuTTY on Windows)

---

## PART 1: VPS Initial Setup

### Step 1: Connect to Your VPS

```bash
# Replace with your VPS IP and username
ssh root@your-vps-ip

# Or if you have a different user:
ssh username@your-vps-ip
```

**First time connection?** Type `yes` when asked about host authenticity.

---

### Step 2: Update System Packages

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y
```

**Why?** Ensures all software is up-to-date and secure.

---

### Step 3: Install Node.js 20

```bash
# Add NodeSource repository for Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show npm version
```

**Why Node 20?** Next.js 16 requires Node.js 18 or higher.

---

### Step 4: Install Required Software

```bash
# Install build tools
sudo apt install -y build-essential

# Install Git
sudo apt install -y git

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install -y nginx

# Install PostgreSQL client tools
sudo apt install -y postgresql-client
```

**What each does:**
- **build-essential**: Compilers needed for some npm packages
- **git**: Version control to clone your code
- **pm2**: Keeps your app running and auto-restarts on crashes
- **nginx**: Web server and reverse proxy
- **postgresql-client**: Tools to interact with PostgreSQL

---

## PART 2: Database Setup

### Step 5: Install PostgreSQL Database

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

Press `q` to exit the status view.

---

### Step 6: Configure PostgreSQL Authentication

```bash
# Edit authentication config
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

**Find these lines** (scroll down past the comments):

```
local   all             postgres                                md5
local   all             all                                     md5
```

**Change them to:**

```
local   all             postgres                                peer
local   all             all                                     peer
```

**What this does:** Allows system users to connect without password (more secure for local connections).

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` for yes
- Press `Enter`

**Restart PostgreSQL:**

```bash
sudo systemctl restart postgresql
```

---

### Step 7: Create Database and User

```bash
# Switch to postgres user and open psql
sudo -i -u postgres
psql
```

You should now see `postgres=#` prompt. **Run these SQL commands:**

```sql
-- Create your database
CREATE DATABASE cake_shop;

-- Create user with password (change 'your_password' to something secure!)
CREATE USER cake_user WITH ENCRYPTED PASSWORD 'your_password';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE cake_shop TO cake_user;

-- Connect to the database
\c cake_shop

-- Grant schema privileges (important for Prisma!)
GRANT ALL ON SCHEMA public TO cake_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cake_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cake_user;

-- Verify user was created
\du

-- Exit PostgreSQL
\q
```

**Exit back to root user:**

```bash
exit
```

**Test the connection:**

```bash
# This should ask for password and connect successfully
psql -h localhost -U cake_user -d cake_shop -c "SELECT version();"
```

Enter your password when prompted.

---

## PART 3: Application Setup

### Step 8: Clone Your Project

```bash
# Create directory
sudo mkdir -p /var/www/cake-shop

# Set ownership (replace $USER with your username if not root)
sudo chown -R $USER:$USER /var/www/cake-shop

# Clone from GitHub
git clone https://github.com/your-username/your-repo.git /var/www/cake-shop

# Navigate to project
cd /var/www/cake-shop

# Verify files are there
ls -la
```

**Troubleshooting DNS issues:**

If `git clone` fails with "Could not resolve host":

```bash
# Add Google DNS
sudo nano /etc/resolv.conf
```

Add these lines at the top:

```
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 1.1.1.1
```

Save and try cloning again.

---

### Step 9: Configure Environment Variables

```bash
cd /var/www/cake-shop

# Create production environment file
nano .env.production
```

**Paste this configuration** (update with YOUR values):

```bash
# ==========================================
# DATABASE CONFIGURATION
# ==========================================
# Replace with your actual database credentials
DATABASE_URL="postgresql://cake_user:your_password@localhost:5432/cake_shop?schema=public"

# ==========================================
# NEXTAUTH CONFIGURATION
# ==========================================
# Generate new secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
# Replace with your actual domain or IP
NEXTAUTH_URL="https://yourdomain.com"

# ==========================================
# EMAIL CONFIGURATION (Gmail SMTP)
# ==========================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
# Get App Password from: https://myaccount.google.com/apppasswords
SMTP_PASSWORD="your-gmail-app-password"
SMTP_FROM="Cake Shop <noreply@yourdomain.com>"

# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
# Your actual domain or IP
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
# Delivery fee in your currency (KSh)
DELIVERY_FEE="500"

# ==========================================
# M-PESA CONFIGURATION (Optional)
# ==========================================
# Get from Safaricom Daraja Portal
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"
MPESA_PASSKEY="your_passkey"
MPESA_SHORT_CODE="174379"
# Use "sandbox" for testing, "production" for live
MPESA_ENVIRONMENT="production"
```

**Important configurations to update:**

1. **DATABASE_URL**: Use the password you set in Step 7
2. **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
3. **NEXTAUTH_URL**: Your domain (e.g., `https://cakes.example.com`)
4. **SMTP credentials**: Your Gmail and App Password
5. **NEXT_PUBLIC_APP_URL**: Same as NEXTAUTH_URL

**Save:** `Ctrl+X`, `Y`, `Enter`

**Create symlink:**

```bash
ln -sf .env.production .env
```

**Why symlink?** Node.js looks for `.env` file by default.

---

### Step 10: Install Dependencies and Build

```bash
cd /var/www/cake-shop

# Install dependencies (clean install)
npm ci

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with initial data (optional)
npm run db:seed

# Build for production
npm run build
```

**What each command does:**
- `npm ci`: Clean install (faster and more reliable than `npm install`)
- `db:generate`: Creates Prisma client for database access
- `db:migrate`: Creates database tables
- `db:seed`: Adds sample data (categories, initial settings)
- `build`: Compiles Next.js for production

**This will take a few minutes.** You should see:

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

### Step 11: Set Up PM2 Process Manager

```bash
# Create PM2 config file
cd /var/www/cake-shop
nano ecosystem.config.js
```

**Paste this:**

```javascript
module.exports = {
  apps: [{
    name: 'cake-shop',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/cake-shop',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

**Save:** `Ctrl+X`, `Y`, `Enter`

**Start the application:**

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Configure PM2 to start on system boot
pm2 startup systemd
```

**Important:** `pm2 startup` will output a command starting with `sudo env...`
**Copy and run that entire command.**

**Check status:**

```bash
pm2 status
```

You should see:

```
┌────┬──────────┬─────────┬──────┬────────┬─────────┬─────────┐
│ id │ name     │ mode    │ ↺    │ status │ cpu     │ memory  │
├────┼──────────┼─────────┼──────┼────────┼─────────┼─────────┤
│ 0  │ cake-shop│ cluster │ 0    │ online │ 0%      │ 70.0mb  │
└────┴──────────┴─────────┴──────┴────────┴─────────┴─────────┘
```

**View logs:**

```bash
pm2 logs cake-shop
```

Press `Ctrl+C` to exit logs.

---

## PART 4: Nginx Web Server Setup

### Step 12: Configure Nginx

**Option A: With Domain Name**

```bash
sudo nano /etc/nginx/sites-available/cake-shop
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Replace `yourdomain.com`** with your actual domain.

---

**Option B: With IP Address Only**

```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save:** `Ctrl+X`, `Y`, `Enter`

---

### Step 13: Enable Nginx Site

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/cake-shop /etc/nginx/sites-enabled/

# Remove default Nginx page (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

You should see:

```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Start Nginx:**

```bash
# Restart Nginx to apply changes
sudo systemctl restart nginx

# Enable auto-start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

Press `q` to exit.

---

## PART 5: SSL Certificate (HTTPS)

### Step 14: Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

---

### Step 15: Get SSL Certificate

**Make sure your domain DNS is pointing to your VPS IP first!**

```bash
# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Follow the prompts:**

1. **Email address:** Enter your email
2. **Terms of Service:** Type `Y` to agree
3. **Share email:** `N` (optional)
4. **Redirect HTTP to HTTPS:** Type `2` (recommended)

Certbot will automatically:
- Get the certificate
- Update Nginx configuration
- Set up auto-renewal

**Test auto-renewal:**

```bash
sudo certbot renew --dry-run
```

---

## PART 6: File Upload Configuration

### Step 16: Set Up Image Upload Directories

```bash
cd /var/www/cake-shop

# Create directories
sudo mkdir -p public/images/team
sudo mkdir -p public/images/users
sudo mkdir -p public/images/cakes

# Set permissions
sudo chown -R $USER:www-data public/images
sudo chmod -R 775 public/images
```

**What this does:** Allows your app to save uploaded images.

---

## PART 7: Firewall Configuration

### Step 17: Configure UFW Firewall

```bash
# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

Type `y` to confirm.

**Check status:**

```bash
sudo ufw status
```

---

## PART 8: Create Admin User

### Step 18: Create First Admin Account

**Option A: Register through the website, then promote:**

1. Visit your site: `https://yourdomain.com`
2. Click "Register" and create an account
3. On VPS, connect to database:

```bash
psql -h localhost -U cake_user -d cake_shop
```

4. Run SQL to make admin:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
\q
```

---

**Option B: Use Prisma Studio:**

```bash
cd /var/www/cake-shop
npx prisma studio --browser none
```

Note the URL it gives you (like `http://localhost:5555`), then on your local machine, create an SSH tunnel:

```bash
# On your local machine
ssh -L 5555:localhost:5555 root@your-vps-ip
```

Then open `http://localhost:5555` in your browser and edit the user.

---

## 📊 PART 9: Monitoring & Management

### Useful PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs cake-shop

# View last 100 lines
pm2 logs cake-shop --lines 100

# Restart application
pm2 restart cake-shop

# Stop application
pm2 stop cake-shop

# Start application
pm2 start cake-shop

# Monitor resources
pm2 monit
```

---

### Useful Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

---

### Useful PostgreSQL Commands

```bash
# Connect to database
psql -h localhost -U cake_user -d cake_shop

# Backup database
pg_dump -h localhost -U cake_user cake_shop > backup_$(date +%Y%m%d).sql

# Restore database
psql -h localhost -U cake_user cake_shop < backup_20251120.sql

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('cake_shop'));"
```

---

## 🔄 PART 10: Updating Your Application

### When You Make Code Changes

```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to project
cd /var/www/cake-shop

# Pull latest changes
git pull origin main

# Install any new dependencies
npm ci

# Generate Prisma client (if schema changed)
npm run db:generate

# Run new migrations (if any)
npm run db:migrate

# Rebuild application
npm run build

# Restart PM2
pm2 restart cake-shop

# Check logs for errors
pm2 logs cake-shop --lines 50
```

---

## 🐛 PART 11: Troubleshooting

### App Not Starting

```bash
# Check PM2 logs
pm2 logs cake-shop --lines 100

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart app
pm2 restart cake-shop
```

---

### Database Connection Issues

```bash
# Test database connection
psql -h localhost -U cake_user -d cake_shop -c "SELECT version();"

# Check PostgreSQL is running
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

---

### Nginx Not Working

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

### Site Not Accessible

```bash
# Check if app is running
pm2 status

# Check if Nginx is running
sudo systemctl status nginx

# Check firewall
sudo ufw status

# Test app directly (should show HTML)
curl http://localhost:3000

# Check DNS (if using domain)
nslookup yourdomain.com
```

---

### Permission Issues with File Uploads

```bash
cd /var/www/cake-shop

# Fix ownership
sudo chown -R $USER:www-data public/images

# Fix permissions
sudo chmod -R 775 public/images

# Check current permissions
ls -la public/images
```

---

## 📝 PART 12: Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your application URL | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://yourdomain.com` |

### Email Variables (Required for notifications)

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Email address | `your-email@gmail.com` |
| `SMTP_PASSWORD` | App password | Get from Google Account settings |
| `SMTP_FROM` | From address | `Cake Shop <noreply@domain.com>` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DELIVERY_FEE` | Delivery cost | `500` |
| `MPESA_CONSUMER_KEY` | M-Pesa API key | From Safaricom Daraja |
| `MPESA_CONSUMER_SECRET` | M-Pesa secret | From Safaricom Daraja |
| `MPESA_PASSKEY` | M-Pesa passkey | From Safaricom Daraja |
| `MPESA_SHORT_CODE` | Paybill number | `174379` |
| `MPESA_ENVIRONMENT` | `sandbox` or `production` | `production` |

---

## 🔒 PART 13: Security Best Practices

### 1. Keep System Updated

```bash
# Run weekly
sudo apt update && sudo apt upgrade -y
```

### 2. Change Default Passwords

```bash
# Change root password
sudo passwd root

# Create non-root user
sudo adduser yourname
sudo usermod -aG sudo yourname
```

### 3. Configure SSH Key Authentication

On your local machine:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096

# Copy to VPS
ssh-copy-id root@your-vps-ip
```

### 4. Disable Password Authentication (Optional)

```bash
sudo nano /etc/ssh/sshd_config
```

Set:
```
PasswordAuthentication no
```

Restart SSH:
```bash
sudo systemctl restart sshd
```

### 5. Regular Backups

```bash
# Create backup script
nano /root/backup.sh
```

Paste:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h localhost -U cake_user cake_shop > $BACKUP_DIR/db_$DATE.sql

# Backup uploaded images
tar -czf $BACKUP_DIR/images_$DATE.tar.gz /var/www/cake-shop/public/images

# Backup environment file
cp /var/www/cake-shop/.env.production $BACKUP_DIR/env_$DATE.txt

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make executable:

```bash
chmod +x /root/backup.sh
```

Schedule daily backups:

```bash
crontab -e
```

Add:

```
0 2 * * * /root/backup.sh >> /var/log/backup.log 2>&1
```

---

## 🎉 PART 14: Verification Checklist

Use this checklist to verify your deployment:

- [ ] VPS accessible via SSH
- [ ] Node.js 20+ installed (`node --version`)
- [ ] PostgreSQL running (`sudo systemctl status postgresql`)
- [ ] Database created and user has permissions
- [ ] Code cloned from GitHub
- [ ] `.env.production` configured with all required variables
- [ ] Dependencies installed (`npm ci`)
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Application built successfully (`npm run build`)
- [ ] PM2 running app (`pm2 status` shows "online")
- [ ] Nginx configured and running
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate installed (site loads with `https://`)
- [ ] Firewall configured (ports 80, 443, 22 open)
- [ ] File upload directories created with correct permissions
- [ ] Admin user created
- [ ] Site accessible in browser
- [ ] Can register new user
- [ ] Can login as admin
- [ ] Admin dashboard accessible
- [ ] Email notifications working (test contact form)
- [ ] Image uploads working

---

## 📚 Additional Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/instructions)

### Helpful Commands Cheat Sheet

```bash
# System
sudo systemctl status [service]    # Check service status
sudo systemctl restart [service]   # Restart service
sudo systemctl enable [service]    # Enable on boot
sudo journalctl -u [service]       # View service logs

# PM2
pm2 list                           # List all apps
pm2 restart all                    # Restart all apps
pm2 delete [name]                  # Remove app from PM2
pm2 save                           # Save current list

# Git
git status                         # Check status
git pull origin main               # Pull latest code
git log --oneline -5               # View last 5 commits

# PostgreSQL
\l                                 # List databases
\dt                                # List tables
\d [table]                         # Describe table
\q                                 # Quit

# Find processes
ps aux | grep node                 # Find Node processes
sudo lsof -i :[port]              # See what's using a port
sudo kill -9 [PID]                # Kill process
```

---

## 🎓 Understanding Key Concepts

### What is PM2?
PM2 is a production process manager that:
- Keeps your app running 24/7
- Restarts automatically if it crashes
- Restarts after server reboots
- Provides logging and monitoring
- Can run multiple instances (clustering)

### What is Nginx?
Nginx is a web server that:
- Handles HTTP/HTTPS requests
- Acts as reverse proxy (forwards requests to your app)
- Manages SSL certificates
- Serves static files efficiently
- Provides load balancing

### What is a Reverse Proxy?
When someone visits your site:
1. Browser → Nginx (port 80/443)
2. Nginx → Your App (port 3000)
3. App → Nginx → Browser

This allows:
- One domain serving multiple apps
- SSL termination at Nginx
- Better security (app doesn't face internet directly)

---

## 💡 Tips for Success

1. **Start Simple**: Get basic deployment working before adding SSL, domain, etc.
2. **Check Logs**: When something breaks, logs tell you why
3. **One Change at a Time**: Test after each configuration change
4. **Keep Backups**: Before major changes, backup database and code
5. **Document Changes**: Note what you changed and why
6. **Test Locally First**: Make sure code works locally before deploying
7. **Use Version Control**: Commit working code before experimenting

---

## 🆘 Getting Help

If stuck:

1. **Check logs first:**
   ```bash
   pm2 logs cake-shop --lines 100
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verify services are running:**
   ```bash
   pm2 status
   sudo systemctl status nginx
   sudo systemctl status postgresql
   ```

3. **Test components individually:**
   - App: `curl http://localhost:3000`
   - Nginx: `sudo nginx -t`
   - Database: `psql -h localhost -U cake_user -d cake_shop`

4. **Search error messages:** Copy exact error and search online

---

## 🎊 Congratulations!

If you've followed all steps, you now have:

✅ A production-ready Next.js application  
✅ Running on Hostinger VPS  
✅ With PostgreSQL database  
✅ Served through Nginx  
✅ Secured with SSL  
✅ Automatically managed by PM2  
✅ Protected by firewall  

Your cake shop is now live! 🎂🚀

---

**Created:** November 2025  
**Version:** 1.0  
**For:** Next.js 16 + PostgreSQL + Hostinger VPS

//path-based routing for each path under www.mainakiburi.com

{/*option one Recommended
server {
    listen 80;
    server_name mainakiburi.com www.mainakiburi.com;

    # Cake shop app
    location /cakes {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Another app on port 4000
    location /blog {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Root path - choose which app or static page
    location / {
        proxy_pass http://127.0.0.1:3000;
        # OR serve static landing page
        # root /var/www/html;
        # index index.html;
    }
}


2.Option 2 subdomain-based(cleanest)
www.mainakiburi.com => main site
cakes.mainakiburi.com => cake shop
blog.mainakiburi.com => blog app
api.mainakiburi.com => api

create separate Nginx configs
/etc/nginx/sites-available/cakes.mainakiburi.com

server {
  listen 80;
  server_name cakes.mainakiburi.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    # ... proxy headers ...
  }
}

enable them
sudo ln -s /etc/nginx/sites-available/cakes.mainakiburi.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/blog.mainakiburi.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
*/}
