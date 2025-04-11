import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://olosuashi.com';

// Fetch slugs from your API
const fetchSlugs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/tours/all-slugs`);
    const data = await response.json();
    return data.data.slugs;
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
};

// Static routes (same as your React Router routes)
const staticRoutes = [
  '',
  'contact',
  'about/sustainability',
  'about/olosuashi-tours',
  'about/safari-guide',
  'faq',
  'tours',
  'booking-success',
  'travel-info/packing',
  'travel-info/visa',
  'profile',
  'profile/bookings',
  'profile/wishlist',
  'profile/settings',
  'signup',
  'signin',
  'forgot-password',
  'verify-email/success',
  'verify-email/failed',
  'unauthorized'
];

const generateSitemap = async () => {
  const slugs = await fetchSlugs();
  
  const staticUrls = staticRoutes.map(route => `
    <url>
      <loc>${BASE_URL}/${route}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const dynamicUrls = slugs.map(slug => `
    <url>
      <loc>${BASE_URL}/tours/${slug}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${dynamicUrls}
    </urlset>
  `;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap();