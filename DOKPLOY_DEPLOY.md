# Dokploy Deployment Guide

Deploy your Ghost blog to Hetzner using Dokploy.

## 📋 Prerequisites

- Hetzner Cloud account
- Domain: blog.gagangulyani.com configured with DNS
- Dokploy account (dokploy.com)

## 🚀 Deployment Steps

### 1. Prepare Environment File

```bash
cp .env.example .env
# Edit .env with your secure passwords
```

Required variables:

- `DB_PASSWORD` - MySQL password for Ghost
- `DB_ROOT_PASSWORD` - MySQL root password
- `MAIL_USER` - Your mail service username
- `MAIL_PASS` - Your mail service API key/password

### 2. Hetzner Server Setup

1. **Create Hetzner Cloud Server**
   - OS: Ubuntu 22.04 LTS
   - Type: CPX11 (2 vCPU, 4 GB RAM) minimum
   - Location: Your preferred region
   - Add SSH key for access

2. **Configure DNS**
   ```
   blog.gagangulyani.com  A  YOUR_HETZNER_IP
   ```

### 3. Dokploy Setup

1. **Connect Server**
   - Login to Dokploy dashboard
   - Add Server → Hetzner
   - Enter API token and select your server
   - Dokploy will install Docker and configure Traefik

2. **Create Application**
   - Applications → New Application
   - Name: ghost-blog
   - Source: Git Repository
   - Repository URL: Your GitHub/GitLab repo
   - Branch: main

3. **Environment Variables**
   - Add all variables from `.env` to Dokploy
   - Mark sensitive values (passwords) as "Secret"

### 4. Deploy

1. **Build & Deploy**
   - Dokploy will detect `docker-compose.yml`
   - Click "Deploy"
   - Wait for build and deployment

2. **Verify**
   - Check logs in Dokploy dashboard
   - Visit: https://blog.gagangulyani.com

### 5. Post-Deployment Setup

1. **Create Admin Account**
   - Visit: https://blog.gagangulyani.com/ghost
   - Complete setup wizard

2. **Import Content**
   - Settings → Labs → Import Content
   - Upload your `ghost-export.json`

3. **Configure Solo Theme**
   - Settings → Design → Activate Solo theme
   - Customize accent color, publication cover, etc.

## 🔧 Maintenance

### Update Ghost

```bash
# Update image version in docker-compose.yml
# Redeploy via Dokploy dashboard
```

### Backup Data

```bash
# MySQL backup
ssh root@your-hetzner-ip
docker exec ghost-blog-mysql-1 mysqldump -u ghost -p ghost > ghost_backup.sql

# Ghost content backup
docker run --rm -v ghost-blog_ghost-content:/data -v $(pwd):/backup alpine tar czf /backup/ghost-content-backup.tar.gz -C /data .
```

### Restore from Backup

```bash
# Restore MySQL
docker exec -i ghost-blog-mysql-1 mysql -u ghost -p ghost < ghost_backup.sql

# Restore content
docker run --rm -v ghost-blog_ghost-content:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/ghost-content-backup.tar.gz"
```

## 🛠️ Troubleshooting

### Ghost won't start

```bash
# Check logs
ssh root@your-hetzner-ip
docker logs ghost-blog-ghost-1
```

### Database connection issues

- Verify MySQL is healthy: `docker ps`
- Check environment variables in Dokploy
- Ensure DB_PASSWORD matches in both services

### SSL certificate issues

- Verify DNS A record points to Hetzner IP
- Check Traefik logs in Dokploy
- Ensure domain is correctly set in docker-compose.yml

## 📁 File Structure on Server

```
/var/lib/dokploy/ghost-blog/
├── docker-compose.yml
├── .env
└── volumes/
    ├── ghost-content/
    └── mysql-data/
```

## 🌐 Domain Configuration

**DNS Records:**

```
Type  Name                    Value               TTL
A     blog.gagangulyani.com   YOUR_HETZNER_IP     3600
```

**SSL:**

- Automatically configured by Traefik/Dokploy
- Let's Encrypt certificates auto-renew

## 📧 Email Configuration

Recommended: **Mailgun**

1. Create account at mailgun.com
2. Add domain: blog.gagangulyani.com
3. Get SMTP credentials
4. Add to `.env`:
   ```
   MAIL_SERVICE=Mailgun
   MAIL_USER=postmaster@mg.blog.gagangulyani.com
   MAIL_PASS=your-mailgun-api-key
   ```

## 💡 Tips

- Use CPX21 (4 vCPU, 8 GB) for better performance with traffic
- Enable automatic backups in Hetzner console
- Set up monitoring alerts in Dokploy
- Keep `.env` file secure - never commit to git

---

**Ready to deploy!** Push code to your repo and deploy via Dokploy dashboard.
