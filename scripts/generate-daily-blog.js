import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';

// Manual .env loader to run on all Node versions without external dependencies
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of envLines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  console.warn("Could not read local .env file:", e.message);
}

// Get API Key from environment
const apiKey = process.env.GEMINI_API_KEY;
const isCI = process.env.GITHUB_ACTIONS === 'true';
const shouldPush = process.argv.includes('--push') || isCI;

if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

// File paths
const projectRoot = process.cwd();
const blogsJsonPath = path.join(projectRoot, 'src', 'data', 'blogsData.json');
const keywordsJsonPath = path.join(projectRoot, 'src', 'data', 'seoKeywords.json');

// Helper to select a banner image based on category
function getBannerForCategory(category) {
  const banners = {
    "Interior Design": [
      "/Silver Heights/FL LV ELE 2.webp",
      "/Sthapatya/ELEVATION 5.webp",
      "/Silver Heights/FL LV ELE 4.webp"
    ],
    "3D Rendering": [
      "/Flora 11/F11 LV ELE 04.webp",
      "/Twin Tower/L4.webp",
      "/Golden Heights/GH MB ELE 1.webp"
    ],
    "Workspace": [
      "/Office Design/N.OFFICE ELE 05.webp",
      "/Office Design/N.OFFICE ELE 02.webp"
    ]
  };
  const list = banners[category] || banners["Interior Design"];
  return list[Math.floor(Math.random() * list.length)];
}

// Helper to delay execution (ms)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Call Gemini API with automatic model fallbacks and exponential backoff retry for HTTP 429 / rate limits
async function generateContentWithFallback(promptText) {
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-flash-latest"
  ];

  let lastError = null;

  for (const model of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    console.log(`📡 Attempting generation with model: ${model}...`);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7
            }
          })
        });

        if (response.status === 429) {
          const waitTime = attempt * 5000;
          console.warn(`⚠️ Rate limit (429) on model ${model}, attempt ${attempt}/3. Waiting ${waitTime / 1000}s...`);
          await sleep(waitTime);
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          console.log(`✅ Success with model ${model}!`);
          return data.candidates[0].content.parts[0].text;
        } else {
          throw new Error(`Invalid response structure from model ${model}`);
        }
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Attempt ${attempt} failed on model ${model}: ${err.message}`);
        if (attempt < 3) await sleep(2000);
      }
    }
  }

  throw new Error(`All Gemini API models failed. Last error: ${lastError?.message}`);
}

async function run() {
  console.log("🚀 Starting Daily Blog Generator...");

  // 1. Read existing blogs and keywords
  if (!fs.existsSync(blogsJsonPath)) {
    console.error(`❌ Blogs database not found at: ${blogsJsonPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(keywordsJsonPath)) {
    console.error(`❌ Keywords file not found at: ${keywordsJsonPath}`);
    process.exit(1);
  }

  const existingBlogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf-8'));
  const keywords = JSON.parse(fs.readFileSync(keywordsJsonPath, 'utf-8'));

  console.log(`Loaded ${existingBlogs.length} existing blogs and ${keywords.length} target keywords.`);

  // 2. Determine which keywords haven't been targeted yet
  const availableKeywords = keywords.filter(k => {
    return !existingBlogs.some(blog => 
      blog.targetKeyword?.toLowerCase() === k.keyword.toLowerCase() || 
      blog.title.toLowerCase().includes(k.keyword.toLowerCase()) ||
      blog.slug.toLowerCase().includes(k.keyword.replace(/\s+/g, '-').toLowerCase())
    );
  });

  let selectedKeywordObj;
  if (availableKeywords.length === 0) {
    console.log("⚠️ All keywords have been targeted. Recycling keyword list (selecting the oldest targeted keyword).");
    selectedKeywordObj = keywords[Math.floor(Math.random() * keywords.length)];
  } else {
    selectedKeywordObj = availableKeywords[0];
    console.log(`🎯 Target Keyword Selected: "${selectedKeywordObj.keyword}"`);
    console.log(`📋 Topic Theme: "${selectedKeywordObj.topic}"`);
  }

  // 3. Prepare the prompt for Gemini
  const promptText = `
You are a world-class Design Director and Lead Architect at Craft - The Design Studio (with offices in Morbi and Rajkot, Gujarat).
Write an extensive, deeply technical, 1500+ word, highly comprehensive blog post targeting the SEO keyword: "${selectedKeywordObj.keyword}".
The article should focus on the topic: "${selectedKeywordObj.topic}".

Your audience includes luxury homeowners, real estate developers, commercial tile/sanitaryware exporters, and architectural clients in Morbi, Rajkot, and across Gujarat.

CRITICAL INSTRUCTIONS (Sentry-style In-Depth Writing Guidelines):
1. **Length & Depth**: Write a substantial, highly detailed post (minimum 1200 - 1500 words). Expand deeply on geometric calculations, physical tolerances, light physics (IOR, reflection coefficients), material science, structural substrate preparations, and civil coordination.
2. **The Opening**: The opening paragraph MUST immediately state the core spatial, material, or visualization problem directly. NEVER start with background introduction or generic studio history.
3. **Structure & Headings**: Use strong, opinionated claims for section headings (e.g. "Why standard 600mm counter depths fail under Indian cooking loads").
   - Section 1: The Core Spatial & Technical Problem
   - Section 2: Mathematical, Geometric & Material Physics Solutions
   - Section 3: Structural Trade-Offs & Alternative Comparisons (e.g. Plywood vs Aluminum, Italian Marble vs Sintered Porcelain)
   - Section 4: Failed Prototypes & Real Site Lessons (Honest accounting of past trial-and-error)
   - Section 5: Non-Negotiable Site Tolerances & Budget Thresholds
   - Section 6: How to Execute with Craft - The Design Studio (Actionable studio contact & consultation workflow)
4. **Banned Clichés**: NEVER use these words: "we're excited to announce", "cutting-edge", "seamless", "leverage", "empower", "unlock", "robust", "at the end of the day", "without further ado".
5. **Concrete Metrics**: Include realistic numbers (e.g. "3200x1600mm format", "12mm thickness", "1.5mm epoxy grout gap", "4000K LED kelvin rating", "IOR of 1.56", "₹2,500/sq ft threshold", "2mm tolerance over 3 meters").
6. **Local Studio Projects Context**: Naturally weave in references to our actual real projects:
   - *Flora 11* (Living room & bedroom visualization in Morbi)
   - *Golden Heights* (High-end penthouse & residential rendering in Morbi)
   - *Silver Heights* (Luxury apartment interior design & rendering in Morbi)
   - *Office Design* (Modern corporate office & experience center design in Morbi)
   - *Sthapatya* (Residential exterior elevation & interior design in Morbi)
   - *Twin Tower* (Contemporary residential & commercial 3D visualization in Rajkot/Morbi)
7. **HTML Output**: Format the body content strictly in HTML (using <p>, <h3>, <blockquote>, <ul>, <li>, and <strong class="keyword"> tags for key phrases). Start the first paragraph with <p class="drop-cap">.
8. **Plain Text Titles & Metadata (CRITICAL)**: The "title", "metaTitle", "metaDescription", "excerpt", and "slug" MUST be clean plain-text strings with ZERO HTML tags (no <strong>, <em>, etc.). HTML markup is strictly prohibited in title and metadata fields.
9. **JSON Format**: Return strict JSON format with this exact schema:

{
  "slug": "unique-url-friendly-lowercase-slug",
  "title": "Compelling Title containing the keyword or variant",
  "metaTitle": "SEO Title tag (under 60 chars)",
  "metaDescription": "SEO Meta Description (under 160 chars, with keyword)",
  "category": "${selectedKeywordObj.category}",
  "excerpt": "Sharp 2-sentence hook summarizing the technical solution for list view.",
  "tags": ["${selectedKeywordObj.keyword}", "${selectedKeywordObj.targetCity}", "Craft Design Studio"],
  "content": "HTML formatted post content..."
}
`;

  // 4. Request generation from Gemini API with fallback
  console.log("🤖 Generating article from Gemini API...");
  try {
    const generatedText = await generateContentWithFallback(promptText);
    
    // Clean up potential markdown formatting block around JSON
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const stripHtml = (str) => typeof str === 'string' ? str.replace(/<[^>]*>/g, '').trim() : str;

    const newBlog = JSON.parse(cleanedText);

    // Sanitize title and metadata fields (remove any accidentally generated HTML tags)
    newBlog.title = stripHtml(newBlog.title);
    newBlog.metaTitle = stripHtml(newBlog.metaTitle);
    newBlog.metaDescription = stripHtml(newBlog.metaDescription);
    newBlog.excerpt = stripHtml(newBlog.excerpt);
    newBlog.slug = stripHtml(newBlog.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (Array.isArray(newBlog.tags)) {
      newBlog.tags = newBlog.tags.map(stripHtml);
    }

    // Ensure unique slug
    let baseSlug = newBlog.slug || selectedKeywordObj.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let finalSlug = baseSlug;
    let counter = 1;
    while (existingBlogs.some(b => b.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    newBlog.slug = finalSlug;

    // Additional metadata fields
    newBlog.targetKeyword = selectedKeywordObj.keyword;
    newBlog.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Calculate read time (approx 200 words per minute)
    const textOnly = newBlog.content.replace(/<[^>]*>/g, '');
    const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
    newBlog.readTime = `${Math.max(4, Math.ceil(wordCount / 200))} min read`;
    
    newBlog.author = selectedKeywordObj.targetCity === 'Morbi' ? 'Vishvarajsinh Zala' : 'Yash Gharvaliya';
    newBlog.banner = getBannerForCategory(newBlog.category);

    console.log(`✅ Article Generated: "${newBlog.title}" (${wordCount} words)`);
    console.log(`Slug: ${newBlog.slug} | Author: ${newBlog.author} | Banner: ${newBlog.banner}`);

    // 5. Prepend new article to blogs list
    existingBlogs.unshift(newBlog);
    fs.writeFileSync(blogsJsonPath, JSON.stringify(existingBlogs, null, 2));
    console.log("💾 Appended new article to src/data/blogsData.json successfully.");

    // 6. Build the project locally to regenerate sitemap and verify bundle compatibility
    console.log("🔨 Building project to verify sitemap updates and build compatibility...");
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log("✅ Project built successfully. sitemap.xml updated.");
    } catch (buildError) {
      console.error("❌ Error during npm run build:", buildError.message);
      process.exit(1);
    }

    // 6.5 Request Indexing via Google Indexing API if credentials present
    const blogUrl = `https://craftdesignstudio.in/blog/${newBlog.slug}`;
    console.log(`📡 Checking Google Indexing API configuration for URL: ${blogUrl}`);
    try {
      let credentials;
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      } else {
        const saPath = path.join(projectRoot, 'service-account.json');
        if (fs.existsSync(saPath)) {
          credentials = JSON.parse(fs.readFileSync(saPath, 'utf-8'));
        }
      }

      if (credentials) {
        console.log("🔑 Google Indexing credentials found. Requesting instant indexing...");
        const token = await getGoogleIndexingToken(credentials.client_email, credentials.private_key);
        const result = await requestGoogleIndexing(blogUrl, token);
        console.log("✅ Google Indexing API Response:", JSON.stringify(result));
      } else {
        console.log("ℹ️ Google Indexing credentials not set up. Skipping instant index ping.");
      }
    } catch (indexingError) {
      console.error("⚠️ Failed to request instant indexing:", indexingError.message);
    }

    // 7. Commit and push if enabled
    if (shouldPush) {
      console.log("📤 Committing and pushing changes to Git repository...");
      try {
        execSync('git add src/data/blogsData.json public/sitemap.xml', { stdio: 'inherit' });
        execSync(`git commit -m "chore: auto-publish daily blog - ${newBlog.title}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log("🚀 Changes pushed to origin/main successfully!");
      } catch (gitError) {
        console.error("❌ Error during git operations:", gitError.message);
        process.exit(1);
      }
    } else {
      console.log("ℹ️ Local test mode: changes saved locally but not pushed to Git.");
    }

    console.log("🎉 Daily Blog Automation Complete!");

  } catch (error) {
    console.error("❌ Error in Daily Blog pipeline:", error);
    process.exit(1);
  }
}

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getGoogleIndexingToken(clientEmail, privateKey) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }));

  const signatureInput = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = base64url(signer.sign(privateKey));

  const jwt = `${signatureInput}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get access token: ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function requestGoogleIndexing(url, accessToken) {
  const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url: url,
      type: 'URL_UPDATED'
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Indexing API error: ${text}`);
  }

  const data = await response.json();
  return data;
}

run();
