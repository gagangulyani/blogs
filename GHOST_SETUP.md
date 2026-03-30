# Ghost + Solo Theme Setup Guide

This repository contains everything you need to migrate your content to Ghost CMS with the Solo theme.

## 📦 What's Included

1. **`ghost-export.json`** - Your content ready for Ghost import (with generalized tags)
2. **`setup-ghost-solo.sh`** - Automated setup script for local Ghost installation
3. **`migrate-to-ghost.js`** - Migration script (already run, generates ghost-export.json)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-ghost-solo.sh
```

This will:

- Check prerequisites (Node.js v18/v20, npm)
- Install Ghost-CLI
- Install Ghost locally in ~/ghost-blog
- Download and install Solo theme
- Start Ghost on http://localhost:2368

### Option 2: Manual Setup

```bash
# 1. Install Ghost-CLI
npm install ghost-cli@latest -g

# 2. Create and enter directory
mkdir ~/ghost-blog && cd ~/ghost-blog

# 3. Install Ghost
ghost install local

# 4. Download Solo theme
cd content/themes
git clone https://github.com/TryGhost/Solo.git solo

# 5. Restart Ghost
cd ../..
ghost restart
```

## 📝 Next Steps After Installation

### 1. Create Admin Account

- Go to http://localhost:2368/ghost
- Follow the setup wizard to create your admin account

### 2. Activate Solo Theme

- Go to **Settings → Design**
- Find "Solo" in the theme list
- Click **Activate**

### 3. Import Your Content

- Go to **Settings → Labs → Import Content**
- Upload `ghost-export.json`
- Verify your 3 posts imported correctly

### 4. Customize Solo Theme

Solo theme customization options:

- **Accent Color**: Settings → Design → Brand → Accent Color
- **Publication Cover**: Settings → Design → Brand → Publication Cover
- **Navigation**: Settings → Design → Navigation
- **Social Links**: Settings → General → Social Accounts

## 🏷️ Your Tags

Your content has been tagged with these generalized categories:

1. **Philosophy** - Stoicism, philosophical insights (3 posts)
2. **Personal Growth** - Self-improvement, development (3 posts)
3. **Mindfulness** - Present moment, awareness (2 posts)
4. **Book Notes** - Lessons from books (3 posts)
5. **Emotional Intelligence** - Managing emotions (2 posts)
6. **Mental Health** - Anxiety, wellbeing (2 posts)

## 🛠️ Ghost Commands

```bash
# From your Ghost directory (~/ghost-blog)
gghost start       # Start Ghost
gghost stop        # Stop Ghost
gghost restart     # Restart Ghost
gghost log         # View logs
gghost ls          # List all Ghost instances
gghost update      # Update Ghost to latest version
```

## 📁 Directory Structure

```
~/ghost-blog/
├── content/
│   ├── data/          # Database files (SQLite3)
│   ├── images/        # Uploaded images
│   ├── logs/          # Log files
│   ├── settings/      # Configuration
│   └── themes/
│       └── solo/      # Solo theme files
├── versions/          # Ghost versions
└── config.development.json
```

## 🎨 Customizing Solo Theme

### Basic CSS Customization

1. Navigate to theme directory:

```bash
cd ~/ghost-blog/content/themes/solo
```

2. Edit CSS files in `/assets/css/`
3. Restart Ghost to see changes:

```bash
gghost restart
```

### Advanced Customization (with build tools)

```bash
cd ~/ghost-blog/content/themes/solo

# Install dependencies
yarn install

# Start development mode (auto-reload)
yarn dev

# Make your CSS changes in /assets/css/
# Files auto-compile to /assets/built/

# Package for production
yarn zip  # Creates dist/solo.zip
```

## 🚀 Going to Production

When ready to deploy:

### Option 1: Ghost Pro (Easiest)

- Sign up at ghost.org
- Import your ghost-export.json
- Upload Solo theme
- Done!

### Option 2: Self-Hosted Production

- Follow: https://ghost.org/docs/install/ubuntu/
- Use same ghost-export.json for content
- Upload Solo theme

## 📚 Resources

- [Ghost Documentation](https://ghost.org/docs/)
- [Solo Theme Demo](https://solo.ghost.io)
- [Ghost Theme Development](https://ghost.org/docs/themes/)
- [Ghost CLI Documentation](https://ghost.org/docs/ghost-cli/)

## ❓ Troubleshooting

### Ghost won't start

```bash
cd ~/ghost-blog
gghost log
# Check for error messages
```

### Port 2368 already in use

```bash
# Find and kill process using port 2368
lsof -ti:2368 | xargs kill -9
# Or change Ghost port in config.development.json
```

### Theme not showing up

```bash
# Ensure theme is in correct location
ls ~/ghost-blog/content/themes/solo/

# Restart Ghost
gghost restart
```

## 📝 Your Content

Your blog posts are ready to import:

1. **"How to deal with anger (the stoic way)"**

   - Topics: Anger management, Stoicism, Self-discipline
   - Tags: Philosophy, Personal Growth, Mindfulness, Book Notes, Emotional Intelligence

2. **"How to deal with anxiety (the stoic way)"**

   - Topics: Anxiety, Stoic philosophy, Mental health
   - Tags: Philosophy, Mental Health, Personal Growth, Mindfulness, Book Notes, Emotional Intelligence

3. **"Dealing with Anxiety Issues triggered by Social Media"**
   - Topics: Social media anxiety, Simplification, Decision making
   - Tags: Philosophy, Mental Health, Personal Growth, Book Notes

---

**Ready to go!** Run `./setup-ghost-solo.sh` to get started.
