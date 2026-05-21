# MAI Investment Platform — Deployment Guide

## Local Development
```
node server.js
```
Open: http://localhost:3000

---

## Deploy to Live Server (VPS / Cloud)

### Option 1: Railway.app (Easiest — Free)

1. Go to https://railway.app and sign up
2. Click **New Project → Deploy from GitHub**
3. Push your project to GitHub first:
   ```
   git init
   git add .
   git commit -m "MAI Investment Platform"
   git remote add origin https://github.com/YOUR_USERNAME/mai-investment.git
   git push -u origin main
   ```
4. In Railway: select your repo → it auto-detects Node.js
5. Set **Start Command**: `node server.js`
6. Railway gives you a free `.railway.app` domain
7. Done — live in 2 minutes

---

### Option 2: Render.com (Free)

1. Go to https://render.com and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: (leave empty)
   - **Start Command**: `node server.js`
   - **Environment**: Node
5. Click **Create Web Service**
6. Free `.onrender.com` domain provided

---

### Option 3: VPS (DigitalOcean / Hostinger / Contabo)

#### Step 1 — Upload files
```bash
# On your VPS (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm -y

# Upload your project (via FTP, SCP, or Git)
git clone https://github.com/YOUR_USERNAME/mai-investment.git
cd mai-investment
```

#### Step 2 — Install PM2 (keeps server running 24/7)
```bash
npm install -g pm2
pm2 start server.js --name "mai"
pm2 save
pm2 startup
```

#### Step 3 — Install Nginx (reverse proxy)
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/mai
```

Paste this config (replace `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4 — Free SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Option 4: Hostinger / cPanel Hosting (Node.js App)

1. Login to Hostinger hPanel
2. Go to **Websites → Manage → Node.js**
3. Click **Create Application**
4. Set:
   - Node.js version: 18 or 20
   - Application root: `/public_html/mai` (or your folder)
   - Application URL: your domain
   - Application startup file: `server.js`
5. Upload all files via File Manager or FTP
6. Click **Start** — your app is live

---

## Important Notes for Production

### Change the PORT
In `server.js` line 8, change:
```js
const PORT = 3000;
```
To use environment variable (required by most hosts):
```js
const PORT = process.env.PORT || 3000;
```

### Persistent Database
The `data/db.json` file stores all data. On Railway/Render, this resets on redeploy.
For persistent storage, use a volume or switch to MongoDB Atlas (free).

### Admin Credentials
- Admin: `admin@mai.com` / `admin123`
- **Change these after first login!**

### Accounts
- Demo user: `demo@mai.com` / `demo123`
- Shadow account: `gdowite95` / (any password)

---

## Quick Start Commands

```bash
# Start server
node server.js

# Start with PM2 (production)
pm2 start server.js --name mai

# View logs
pm2 logs mai

# Restart
pm2 restart mai

# Stop
pm2 stop mai
```
