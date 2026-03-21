# Blog Setup Complete!

## What's Been Done

✅ **Phase 1:** Cloned "blahg" Astro theme with TinaCMS
✅ **Phase 2:** Set up site configuration for blog.gagangulyani.com
✅ **Phase 3:** Migrated all 3 existing blog posts:
   - Dealing with Anxiety Issues triggered by Social Media
   - How to deal with anger (the stoic way)
   - How to deal with anxiety (the stoic way)
✅ **Phase 4:** Created About page with your bio
✅ **Phase 5:** Updated navigation and site settings
✅ **Phase 6:** Committed all changes to Git

---

## Next Steps

### 1. Get TinaCMS Credentials

Go to [tina.io](https://tina.io) and get these values:
- **TINACLIENTID**
- **TINATOKEN**  
- **TINASEARCH**

Create `.env.development` file:
```
TINACLIENTID=your_client_id_here
TINATOKEN=your_token_here
TINASEARCH=your_search_token_here
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

**Option B: GitHub Integration (Recommended)**
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Set build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `./dist`
   - **Environment Variables:** Add TINACLIENTID, TINATOKEN, TINASEARCH

### 3. Configure DNS

In your DNS provider (where gagangulyani.com is hosted), add:

```
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
TTL: 3600
```

### 4. Set Custom Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add: `blog.gagangulyani.com`
4. Vercel will detect the CNAME and verify

---

## Writing Content

### Via TinaCMS (Rich Text Editor)
Once deployed, visit: `https://blog.gagangulyani.com/admin`

### Direct Markdown
Add files to `/posts/` directory with this format:
```yaml
---
title: Your Title
slug: your-slug
description: Brief description
tags:
  - tag1
  - tag2
added: "Mar 22 2024"
---

Your content here...
```

---

## Project Structure

```
├── posts/                 # Blog posts (Markdown)
├── src/
│   ├── pages/
│   │   ├── about.md      # About page
│   │   ├── posts.astro     # Posts listing
│   │   └── ...
│   ├── components/         # Astro components
│   └── settings/
│       └── settings.json   # Site config
├── tina/
│   └── config.js          # TinaCMS configuration
├── public/                # Static assets
└── astro.config.mjs       # Astro config
```

---

## Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Features Included

✨ **Rich text editing** via TinaCMS
📝 **Markdown support** for direct editing
🏷️ **Tag system** for organizing posts
🔍 **Search functionality** built-in
📱 **RSS feed** (`/rss.xml`)
🗺️ **Sitemap** (`/sitemap-index.xml`)
🌙 **Clean, minimal design**
⚡ **Fast static generation**

---

## Need Help?

- TinaCMS docs: https://tina.io/docs
- Astro docs: https://docs.astro.build
- Original template: https://github.com/cassidoo/blahg
