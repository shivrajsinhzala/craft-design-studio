import { blogsData } from '../data/blogsData.js';

export async function GET(context) {
  const DOMAIN = 'https://craftdesignstudio.in';
  
  const rssItems = blogsData.map(blog => {
    let pubDate;
    try {
      const parsed = new Date(blog.date);
      pubDate = isNaN(parsed.getTime()) ? new Date().toUTCString() : parsed.toUTCString();
    } catch {
      pubDate = new Date().toUTCString();
    }

    const title = (blog.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const desc = (blog.metaDescription || blog.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const url = `${DOMAIN}/blog/${blog.slug}/`;

    return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${blog.category || 'Interior Design'}</category>
      <author>hello@craftdesignstudio.in (${blog.author || 'Vishvarajsinh Zala'})</author>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Craft Design Studio | Design Journal &amp; Insights</title>
    <link>${DOMAIN}/blog/</link>
    <description>Insights on luxury interior design, 3D architectural visualization, and turnkey solutions in Morbi &amp; Rajkot, Gujarat.</description>
    <language>en-in</language>
    <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
