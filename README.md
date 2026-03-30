# Personal Blog - Migration to Ghost

This is the source repository for my personal blog, migrating from a static site to Ghost CMS with the Solo theme.

## About This Blog

I write about practical philosophy, mental health, and personal growth - often with lessons learned from books I'm reading. Topics include:

- **Stoicism** and how ancient philosophy applies to modern life
- **Managing emotions** like anger and anxiety
- **Personal development** and self-discipline
- **Book notes** and lessons from authors like Seneca

## 📦 Migration Files

- **`ghost-export.json`** - Content export ready for Ghost import
- **`setup-ghost-solo.sh`** - Automated setup script for local Ghost + Solo theme
- **`GHOST_SETUP.md`** - Detailed setup and customization guide
- **`posts/`** - Original markdown content (backup)

## 🚀 Setup Instructions

```bash
# Run automated setup
./setup-ghost-solo.sh
```

Then:

1. Open http://localhost:2368/ghost
2. Create admin account
3. Go to Settings → Design → Activate "solo" theme
4. Settings → Labs → Import Content → Upload `ghost-export.json`

## 🏷️ Content Organization

Posts are tagged with 6 broad categories:

- **Philosophy** (3 posts) - Stoicism, philosophical insights
- **Personal Growth** (3 posts) - Self-improvement, development
- **Mental Health** (2 posts) - Anxiety, wellbeing
- **Book Notes** (3 posts) - Lessons from books I'm reading
- **Mindfulness** (2 posts) - Present moment, awareness
- **Emotional Intelligence** (2 posts) - Managing emotions

## 📝 Content

3 blog posts currently:

1. How to deal with anger (the stoic way)
2. How to deal with anxiety (the stoic way)
3. Dealing with Anxiety Issues triggered by Social Media

## 🔗 Resources

- [Ghost Documentation](https://ghost.org/docs/)
- [Solo Theme Demo](https://solo.ghost.io)
- [Ghost CLI](https://ghost.org/docs/ghost-cli/)

---

**Get it running:** `./setup-ghost-solo.sh`
