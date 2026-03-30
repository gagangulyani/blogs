#!/usr/bin/env node

/**
 * Ghost CMS Migration Script
 *
 * Converts markdown blog posts to Ghost-compatible JSON format
 * Usage: node migrate-to-ghost.js
 */

const fs = require("fs");
const path = require("path");

// Simple markdown parser for frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatterText = match[1];
  const body = match[2].trim();

  // Parse YAML-like frontmatter
  const frontmatter = {};
  let currentKey = null;
  let currentValue = [];
  let inArray = false;
  let inMultiline = false;

  const lines = frontmatterText.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.match(/^\s+- /)) {
      // Array item
      const value = line.replace(/^\s+- /, "");
      if (currentKey) {
        if (!frontmatter[currentKey]) frontmatter[currentKey] = [];
        frontmatter[currentKey].push(value);
      }
      inArray = true;
    } else if (line.match(/^[a-zA-Z_]+:/)) {
      // New key - save previous value if exists
      if (currentKey && !inArray && currentValue.length > 0) {
        frontmatter[currentKey] = currentValue.join(" ").trim();
      }
      inMultiline = false;
      const match = line.match(/^([a-zA-Z_]+):\s*(>?-?\s*)(.*)$/);
      currentKey = match[1];
      const multilineIndicator = match[2].trim();
      const value = match[3];

      if (
        multilineIndicator.includes(">") ||
        multilineIndicator.includes("-")
      ) {
        inMultiline = true;
        currentValue = value ? [value] : [];
      } else {
        currentValue = value ? [value] : [];
        inArray = false;
      }
    } else if (line.match(/^\s+/) && currentKey) {
      // Continuation of multiline value
      if (inMultiline) {
        currentValue.push(line.trim());
      } else if (!inArray) {
        currentValue.push(line.trim());
      }
    }
  }

  // Save last key
  if (currentKey && !inArray && currentValue.length > 0) {
    frontmatter[currentKey] = currentValue.join(" ").trim();
  }

  return { frontmatter, body };
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

  // Process lists line by line
  const lines = html.split("\n");
  let result = [];
  let inBulletList = false;
  let inNumberedList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const bulletMatch = line.match(/^\s*-\s+(.*)$/);
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (bulletMatch) {
      if (inNumberedList) {
        result.push("</ol>");
        inNumberedList = false;
      }
      if (!inBulletList) {
        result.push("<ul>");
        inBulletList = true;
      }
      result.push(`<li>${bulletMatch[1]}</li>`);
    } else if (numberedMatch) {
      if (inBulletList) {
        result.push("</ul>");
        inBulletList = false;
      }
      if (!inNumberedList) {
        result.push("<ol>");
        inNumberedList = true;
      }
      result.push(`<li>${numberedMatch[2]}</li>`);
    } else {
      if (inBulletList) {
        result.push("</ul>");
        inBulletList = false;
      }
      if (inNumberedList) {
        result.push("</ol>");
        inNumberedList = false;
      }
      result.push(line);
    }
  }

  // Close any open lists
  if (inBulletList) result.push("</ul>");
  if (inNumberedList) result.push("</ol>");

  html = result.join("\n");

  // Paragraphs (must be last)
  html = html
    .split("\n\n")
    .map((p) => {
      p = p.trim();
      if (p && !p.match(/^<[^>]+>/)) {
        return `<p>${p}</p>`;
      }
      return p;
    })
    .join("\n\n");

  return html;
}

// Content-based tagging system
const GENERALIZED_TAGS = {
  philosophy: { id: null, name: "Philosophy", slug: "philosophy" },
  mentalHealth: { id: null, name: "Mental Health", slug: "mental-health" },
  personalGrowth: {
    id: null,
    name: "Personal Growth",
    slug: "personal-growth",
  },
  mindfulness: { id: null, name: "Mindfulness", slug: "mindfulness" },
  bookNotes: { id: null, name: "Book Notes", slug: "book-notes" },
  emotionalIntelligence: {
    id: null,
    name: "Emotional Intelligence",
    slug: "emotional-intelligence",
  },
};

// Assign tags based on content analysis
function assignTags(postId, title, body, file) {
  const tags = [];
  const content = (title + " " + body).toLowerCase();

  // Philosophy tag - stoicism, philosophical content
  if (
    content.includes("stoic") ||
    content.includes("philosophy") ||
    content.includes("seneca")
  ) {
    tags.push("philosophy");
  }

  // Mental Health tag - anxiety, depression, psychological issues
  if (
    content.includes("anxiety") ||
    content.includes("mental health") ||
    content.includes("depression")
  ) {
    tags.push("mentalHealth");
  }

  // Personal Growth tag - self-improvement, development, goals
  if (
    content.includes("self discipline") ||
    content.includes("growth") ||
    content.includes("improvement") ||
    content.includes("progress") ||
    content.includes("goals") ||
    content.includes("habits")
  ) {
    tags.push("personalGrowth");
  }

  // Mindfulness tag - present moment, awareness, meditation
  if (
    content.includes("present") ||
    content.includes("mindfulness") ||
    content.includes("awareness") ||
    content.includes("living in the moment") ||
    content.includes("meditation")
  ) {
    tags.push("mindfulness");
  }

  // Book Notes tag - references to books, reading, lessons from books
  if (
    content.includes("book") ||
    content.includes("audiobook") ||
    content.includes("reading") ||
    file.includes("breakfast") ||
    file.includes("seneca") ||
    content.includes("i have read")
  ) {
    tags.push("bookNotes");
  }

  // Emotional Intelligence tag - anger, emotions, self-control
  if (
    content.includes("anger") ||
    content.includes("emotional") ||
    content.includes("feelings") ||
    content.includes("self control") ||
    content.includes("emotion")
  ) {
    tags.push("emotionalIntelligence");
  }

  return tags;
}
function parseDate(dateStr) {
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const parts = dateStr.match(/([A-Za-z]+)\s+(\d+)\s+(\d+)/);
  if (!parts) return new Date().toISOString();

  const month = months[parts[1]];
  const day = parseInt(parts[2]);
  const year = parseInt(parts[3]);

  // Use UTC to preserve the exact date from the frontmatter
  const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
  return date.toISOString().replace("T", " ").split(".")[0];
}

// Generate unique ID
let idCounter = 1;
function generateId() {
  return String(idCounter++);
}

// Main migration function
function migrateToGhost() {
  const postsDir = path.join(__dirname, "posts");
  const outputPath = path.join(__dirname, "ghost-export.json");

  // Read all markdown files
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  const posts = [];
  const postsMeta = [];
  const allTags = [];
  const postsTags = [];
  const tagMap = new Map();

  console.log(`Found ${files.length} markdown files to migrate...\n`);

  for (const file of files) {
    console.log(`Processing: ${file}`);

    const content = fs.readFileSync(path.join(postsDir, file), "utf8");
    const parsed = parseFrontmatter(content);

    if (!parsed) {
      console.warn(`  ⚠️  Skipping ${file} - no frontmatter found`);
      continue;
    }

    const { frontmatter, body } = parsed;
    const postId = generateId();

    // Convert markdown to HTML
    const html = markdownToHtml(body);

    // Assign generalized tags based on content analysis
    const assignedTagKeys = assignTags(postId, frontmatter.title, body, file);
    const tagIds = [];

    for (const tagKey of assignedTagKeys) {
      const tag = GENERALIZED_TAGS[tagKey];
      if (!tag.id) {
        tag.id = generateId();
        allTags.push({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        });
      }
      tagIds.push(tag.id);
    }

    // Create post relationships
    for (const tagId of tagIds) {
      postsTags.push({
        post_id: postId,
        tag_id: tagId,
      });
    }

    // Create post
    const publishedAt = parseDate(frontmatter.added);

    posts.push({
      id: postId,
      title: frontmatter.title || "Untitled",
      slug: frontmatter.slug || file.replace(".md", ""),
      html: html,
      comment_id: file.replace(".md", ""),
      type: "post",
      status: "published",
      visibility: "public",
      created_at: publishedAt,
      updated_at: publishedAt,
      published_at: publishedAt,
      custom_excerpt: frontmatter.description || "",
    });

    // Add post meta if there's a description
    if (frontmatter.description) {
      postsMeta.push({
        post_id: postId,
        meta_title: frontmatter.title,
        meta_description: frontmatter.description,
      });
    }

    console.log(`  ✓ Migrated: "${frontmatter.title}"`);
  }

  // Create the Ghost JSON structure
  const ghostExport = {
    meta: {
      exported_on: Date.now(),
      version: "5.0.0",
    },
    data: {
      posts: posts,
      posts_meta: postsMeta,
      tags: allTags,
      posts_tags: postsTags,
      users: [],
      posts_authors: [],
    },
  };

  // Write output file
  fs.writeFileSync(outputPath, JSON.stringify(ghostExport, null, 2));

  console.log(`\n✅ Migration complete!`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Tags: ${allTags.length}`);
  console.log(`   - Output: ghost-export.json`);
  console.log(`\n📖 Next steps:`);
  console.log(
    "   1. Go to your Ghost Admin → Settings → Labs → Import Content",
  );
  console.log("   2. Upload the generated ghost-export.json file");
  console.log("   3. Verify your posts imported correctly");
}

// Run migration
migrateToGhost();
