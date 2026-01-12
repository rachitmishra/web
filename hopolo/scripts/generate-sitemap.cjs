const fs = require('fs');
const path = require('path');

const baseUrl = 'https://hopolo.vercel.app';
const routes = [
  '/',
  '/about',
  '/shipping',
  '/contact',
];

// In a real environment, you'd fetch product slugs from Firestore here
const mockProductIds = ['1', '2']; 

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${baseUrl}${route}</url>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${mockProductIds.map(id => `
  <url>
    <loc>${baseUrl}/product/${id}</url>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!');
