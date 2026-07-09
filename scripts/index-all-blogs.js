import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const projectRoot = process.cwd();
const blogsJsonPath = path.join(projectRoot, 'src', 'data', 'blogsData.json');
const saPath = path.join(projectRoot, 'service-account.json');

if (!fs.existsSync(blogsJsonPath)) {
  console.error("❌ Blogs database not found.");
  process.exit(1);
}
if (!fs.existsSync(saPath)) {
  console.error("❌ service-account.json credentials not found.");
  process.exit(1);
}

const blogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf-8'));
const credentials = JSON.parse(fs.readFileSync(saPath, 'utf-8'));

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
    throw new Error(`Indexing API error for ${url}: ${text}`);
  }

  return await response.json();
}

async function run() {
  console.log("🚀 Initializing Google Indexing API submission for all pages...");
  try {
    const token = await getGoogleIndexingToken(credentials.client_email, credentials.private_key);
    console.log("🔑 Google Authentication Successful!");

    // Submit homepage
    const homepageUrl = "https://craftdesignstudio.in/";
    console.log(`📡 Pinging Google Indexing API for Homepage: ${homepageUrl}`);
    const homeResult = await requestGoogleIndexing(homepageUrl, token);
    console.log("✅ Homepage submitted successfully:", JSON.stringify(homeResult));

    // Submit each blog post
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const blogUrl = `https://craftdesignstudio.in/blog/${blog.slug}`;
      console.log(`📡 [${i + 1}/${blogs.length}] Pinging Google Indexing API for: ${blogUrl}`);
      try {
        const result = await requestGoogleIndexing(blogUrl, token);
        console.log(`   └─> Success:`, JSON.stringify(result));
      } catch (err) {
        console.error(`   └─> Failed:`, err.message);
      }
      // Brief sleep to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("🎉 All pages submitted to Google Search Indexing successfully!");
  } catch (error) {
    console.error("❌ Indexing execution failed:", error.message);
  }
}

run();
