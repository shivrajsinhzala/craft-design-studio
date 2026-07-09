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
  // Select one based on random choice
  return list[Math.floor(Math.random() * list.length)];
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
      blog.targetKeyword === k.keyword || 
      blog.title.toLowerCase().includes(k.keyword.toLowerCase()) ||
      blog.slug.includes(k.keyword.replace(/\s+/g, '-').toLowerCase())
    );
  });

  let selectedKeywordObj;
  if (availableKeywords.length === 0) {
    console.log("⚠️ All keywords have been targeted. Recycling keyword list (selecting the oldest/first one).");
    selectedKeywordObj = keywords[0];
  } else {
    selectedKeywordObj = availableKeywords[0];
    console.log(`🎯 Target Keyword Selected: "${selectedKeywordObj.keyword}"`);
    console.log(`📋 Topic Theme: "${selectedKeywordObj.topic}"`);
  }

  // 3. Prepare the prompt for Gemini
  const promptText = `
You are a highly talented Design Director at Craft - The Design Studio (based in Morbi and Rajkot, Gujarat).
Write a professional, technical, and deeply insightful blog post targeting the SEO keyword: "${selectedKeywordObj.keyword}".
The article should address the topic: "${selectedKeywordObj.topic}".

Your target audience consists of premium homeowners, builders, and real estate developers looking for world-class design standards in Morbi and Rajkot.

CRITICAL INSTRUCTIONS (Sentry-style Blog Writing Guidelines):
1. **The opening**: The opening must do one of two things: state the problem or state the conclusion. NEVER start with background, company history, or hype. Start directly with the issue.
2. **Structure**: 
   - Section 1: What problem does this solve? (State the core spatial or rendering conflict clearly)
   - Section 2: How does it actually work? (Include technical details, dimensions, geometry, render passes, light bouncing, or material properties)
   - Section 3: What were the trade-offs or alternatives? (Why did we make this decision instead of other approaches?)
   - Section 4: What did we try that didn't work? (Honest accounting of design failures or trial-and-error details)
   - Section 5: What are the known limitations? (Intellectually honest limitations - e.g. structural wiring setup requirements, budget thresholds, or masonry prep)
   - Section 6: How to use/try/implement this? (Next steps to contact Craft Design Studio)
3. **Banned Language**: NEVER use these words/phrases under any circumstances:
   - "we're excited/thrilled to announce"
   - "best-in-class" / "industry-leading" / "cutting-edge"
   - "seamless" / "seamlessly" (nothing is seamless)
   - "empower" / "leverage" / "unlock"
   - "robust"
   - "At Craft Design Studio, we believe..."
   - "streamline"
   - Filler transitions: "that being said", "it's worth noting that", "at the end of the day", "without further ado", "as you might know"
   - "in this blog post, we will explore..."
4. **Section Headings**: Headings must convey specific information. DO NOT use generic headings like "Background", "Architecture", "Conclusion". Use strong, opinionated claims (e.g. "Why large-format vitrified slabs destroy spatial proportions on short walls").
5. **Numbers over adjectives**: Include concrete, realistic measurements, stats, or metrics (e.g. "reduced render times from 4 hours to 18 minutes", "p99 client satisfaction rate", "12mm alignment margins", "3200x1600mm sizing").
6. **Real Studio Projects & Context**: Work in references to our actual projects when talking about design examples in Morbi or Rajkot:
   - *Flora 11* (Living room / bedroom renders in Morbi)
   - *Golden Heights* (Premium residential rendering in Morbi)
   - *Silver Heights* (Luxury apartment design and visualization in Morbi)
   - *Office Design* (Modern corporate office design in Morbi)
   - *Sthapatya* (Residential exterior and interior elevation in Morbi)
   - *Twin Tower* (Contemporary residential visualization in Morbi)
7. **HTML Output**: Write the blog content using standard HTML markup (use <p>, <h3>, <blockquote>, <strong>, <em>, <ul>, <li>). Do not use <h1> or <h2> (these are handled by the template). Start the first paragraph with a drop cap class: <p class="drop-cap">.
8. **JSON Format**: Return the response in strict JSON format matching the schema details.

OUTPUT JSON SCHEMA:
{
  "slug": "url-friendly-lowercase-slug-without-trailing-slashes",
  "title": "Compelling Title containing the keyword or a variant of it (no generic announcements)",
  "metaTitle": "SEO Title tag (under 60 characters)",
  "metaDescription": "SEO Meta Description (under 160 characters, with keyword)",
  "category": "${selectedKeywordObj.category}",
  "excerpt": "A sharp 1-2 sentence hook summarizing the article for the list view.",
  "tags": ["Keyword-based tag", "Location-based tag (Morbi or Rajkot)", "Design Theme"],
  "content": "HTML content of the post..."
}
`;

  // 4. Request generation from Gemini API
  console.log("🤖 Generating article from Gemini API...");
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON output
    const newBlog = JSON.parse(generatedText);
    
    // Add additional metadata fields
    newBlog.targetKeyword = selectedKeywordObj.keyword;
    newBlog.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Calculate read time (approx 200 words per minute)
    const wordCount = newBlog.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    newBlog.readTime = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;
    
    newBlog.author = selectedKeywordObj.targetCity === 'Morbi' ? 'Vishvarajsinh Zala' : 'Yash Gharvaliya';
    newBlog.banner = getBannerForCategory(newBlog.category);

    console.log(`✅ Article Generated: "${newBlog.title}"`);
    console.log(`Banner: ${newBlog.banner} | Author: ${newBlog.author}`);

    // 5. Save the new blog post (prepend it to blogs list so it shows as featured)
    existingBlogs.unshift(newBlog);
    fs.writeFileSync(blogsJsonPath, JSON.stringify(existingBlogs, null, 2));
    console.log("💾 Appended new article to src/data/blogsData.json successfully.");

    // 6. Build the project locally to regenerate sitemap and bundle assets
    console.log("🔨 Building project to verify sitemap updates and build compatibility...");
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log("✅ Project built successfully. sitemap.xml generated.");
    } catch (buildError) {
      console.error("❌ Error during npm run build:", buildError.message);
      // Don't exit yet; write is complete but build validation failed.
      process.exit(1);
    }

    // 6.5 Request Indexing via Google Indexing API
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
        console.log("ℹ️ Google Indexing credentials not set up (no service-account.json or GOOGLE_SERVICE_ACCOUNT_JSON env var). Skipping instant index ping.");
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
      console.log("ℹ️ Dry-run mode / local development: changes saved locally but not pushed to Git.");
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
  const response = await fetch('https://indexing.googleapis.com/v1/urlNotifications:publish', {
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
