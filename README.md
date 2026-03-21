# Gagan's Blog

Personal blog built with Astro and TinaCMS.

## Setup

1. Clone the repository
2. Run `npm install`
3. Create `.env.development` file with your TinaCMS credentials (see below)
4. Run `npm run dev` to start the development server

## Environment Variables

Create a `.env.development` file:

```
TINACLIENTID=your_tina_client_id
TINATOKEN=your_tina_token
TINASEARCH=your_tina_search_token
```

## Writing Content

### Option 1: Via TinaCMS (Rich Text Editor)
Visit `localhost:4321/admin` to use the rich text editor.

### Option 2: Direct Markdown
Add Markdown files to the `/posts/` directory with the following frontmatter:

```yaml
---
title: Your Post Title
slug: your-post-slug
description: Brief description of your post
tags:
  - tag1
  - tag2
added: "MMM DD YYYY"
---
```

## Deployment

This blog is configured for deployment on Vercel with the following settings:
- **Build Command:** `npm run build`
- **Output Directory:** `./dist`
- **Install Command:** `npm install`

## Domain

Blog is hosted at: https://blog.gagangulyani.com

## Structure

- `/posts/` - Blog posts in Markdown format
- `/src/pages/about.md` - About page
- `/src/settings/settings.json` - Site configuration
- `/public/` - Static assets
- `/tina/` - TinaCMS configuration

## Credits

Built with [Astro](https://astro.build) and [TinaCMS](https://tina.io)
Based on the [blahg](https://github.com/cassidoo/blahg) template by Cassidy Williams
