import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://olosuashi.com';

// Enhanced route configuration
const publicRoutes = [
  // Main pages
  { path: '', priority: 1.0, description: 'Homepage of Olosuashi Tours' },
  
  // About sections
  { path: 'about/sustainability', description: 'Our sustainability practices' },
  { path: 'about/olosuashi-tours', description: 'About our company' },
  { path: 'about/safari-guide', description: 'Meet our safari guides' },

  // Travel info
  { path: 'travel-info/packing', description: 'Packing list for your trip' },
  { path: 'travel-info/visa', description: 'Visa requirements' },
  { path: 'travel-info/payment', description: 'Payment options' },

  // Experiences
  { path: 'experience', description: 'All travel experiences' },
  { path: 'experience/tree-planting', description: 'Tree planting experience' },
  { path: 'experience/train', description: 'SGR train experience' },
  { path: 'experience/customized', description: 'Custom safari packages' },

  // Special offers
  { path: 'offers/easter-family', description: 'Easter family package' },
  { path: 'offers/easter-couples', description: 'Easter couples retreat' },
  { path: 'offers/easter-group', description: 'Easter group safari' },

  // Mountain climbing
  { path: 'mountain-climbing/equipment', description: 'Climbing equipment rental' },
  { path: 'mountain-climbing/preparation', description: 'Mountain climbing guide' },

  // User pages
  { path: 'profile', description: 'User profile' },
  { path: 'profile/bookings', description: 'Your bookings' },
  { path: 'profile/experience-bookings', description: 'Your experience bookings' },
  { path: 'profile/wishlist', description: 'Your saved items' },
  { path: 'profile/settings', description: 'Account settings' },

  // Auth pages (lower priority as we don't want these indexed)
  { path: 'signup', priority: 0.3, noindex: true },
  { path: 'signin', priority: 0.3, noindex: true },
  { path: 'forgot-password', priority: 0.1, noindex: true },
  { path: 'verify-email/success', priority: 0.1, noindex: true },
  { path: 'verify-email/failed', priority: 0.1, noindex: true },

  // System pages
  { path: 'unauthorized', priority: 0.1, noindex: true },
  { path: 'booking-success', priority: 0.5, noindex: true },
  { path: 'booking-experience-success', priority: 0.5, noindex: true }
];

const fetchSlugs = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`);
    const data = await response.json();
    return data.data.slugs || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

const generateSitemap = async () => {
  const [tourSlugs, experienceSlugs] = await Promise.all([
    fetchSlugs('tours/all-slugs'),
    fetchSlugs('experiences/all-slugs') // Add this endpoint if needed
  ]);

  const staticUrls = publicRoutes.map(route => {
    if (route.noindex) return ''; // Skip noindex routes
    
    return `
    <url>
      <loc>${BASE_URL}/${route.path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route.priority || 0.8}</priority>
      ${route.description ? `
      <image:image>
        <image:loc>${BASE_URL}/title-logo.png</image:loc>
        <image:caption>${route.description}</image:caption>
      </image:image>` : ''}
    </url>
    `;
  }).join('');

  const dynamicUrls = [
    ...tourSlugs.map(slug => `
      <url>
        <loc>${BASE_URL}/tours/${slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `),
    ...experienceSlugs.map(slug => `
      <url>
        <loc>${BASE_URL}/experience/${slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `)
  ].join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${staticUrls}
      ${dynamicUrls}
    </urlset>
  `;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('Sitemap generated with:', {
    staticRoutes: publicRoutes.filter(r => !r.noindex).length,
    tourSlugs: tourSlugs.length,
    experienceSlugs: experienceSlugs.length
  });
};

generateSitemap();