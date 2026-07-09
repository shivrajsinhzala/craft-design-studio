import fs from 'fs';
import path from 'path';

import { projectsData } from './src/data/projectsData.js';

// Read blogsData directly from JSON to avoid ESM JSON import issues in Node
const blogsData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'blogsData.json'), 'utf-8')
);

const DOMAIN = 'https://craftdesignstudio.in';

function generateSitemap() {
  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const sitemapFooter = `\n</urlset>`;
  const urls = [];

  const addUrl = (route, priority = 0.8, changefreq = 'monthly') => {
    urls.push(`
  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  };

  // Core Pages
  addUrl('/', 1.0, 'weekly');
  addUrl('/blog', 0.9, 'weekly');

  // Dynamic Projects
  projectsData.forEach(project => {
    addUrl(`/project/${project.id}`, 0.8, 'monthly');
  });

  // Dynamic Blogs
  blogsData.forEach(blog => {
    addUrl(`/blog/${blog.slug}`, 0.7, 'monthly');
  });

  const sitemapContent = sitemapHeader + urls.join('') + sitemapFooter;
  
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapContent);
  console.log('✅ sitemap.xml generated successfully!');
}

generateSitemap();
