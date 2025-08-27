// SEO utility functions for generating meta tags, structured data, and sitemap

interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl: string;
  noindex?: boolean;
}

interface EventSEOData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  images: string[];
  tags: string[];
  url: string;
}

/**
 * Updates document meta tags for SEO
 */
export const updateSEOTags = (seo: SEOMetaTags) => {
  // Update title
  document.title = seo.title;

  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: seo.description },
    { name: 'keywords', content: seo.keywords || '' },
    { name: 'robots', content: seo.noindex ? 'noindex,nofollow' : 'index,follow' }
  ];

  metaTags.forEach(({ name, content }) => {
    if (!content && name !== 'robots') return;
    
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  });

  // Update Open Graph tags
  const ogTags = [
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:image', content: seo.ogImage || '' },
    { property: 'og:url', content: seo.canonicalUrl },
    { property: 'og:type', content: seo.ogType || 'website' },
    { property: 'og:site_name', content: 'Laurence Photo Hub' }
  ];

  ogTags.forEach(({ property, content }) => {
    if (!content) return;
    
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  });

  // Update Twitter Card tags
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: seo.ogImage || '' }
  ];

  twitterTags.forEach(({ name, content }) => {
    if (!content && name !== 'twitter:card') return;
    
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  });

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', seo.canonicalUrl);
};

/**
 * Generates structured data for events
 */
export const generateEventStructuredData = (event: EventSEOData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "location": {
      "@type": "Place",
      "name": event.location
    },
    "organizer": {
      "@type": "Organization",
      "name": event.organizer
    },
    "image": event.images,
    "url": event.url,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "keywords": event.tags.join(', ')
  };
};

/**
 * Generates structured data for image galleries
 */
export const generateImageGalleryStructuredData = (images: Array<{url: string, caption?: string, photographer?: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "image": images.map(img => ({
      "@type": "ImageObject",
      "url": img.url,
      "caption": img.caption || "",
      "creator": img.photographer || "Laurence Photo Hub"
    }))
  };
};

/**
 * Generates structured data for organization
 */
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Laurence Photo Hub",
    "description": "Premium event photography sharing platform for professionals",
    "url": "https://laurencephotohub.com",
    "logo": "https://laurencephotohub.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/laurencephotohub",
      "https://www.facebook.com/laurencephotohub"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-PHOTO-HUB",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };
};

/**
 * Generates breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

/**
 * Inserts structured data script into document head
 */
export const insertStructuredData = (data: object, id?: string) => {
  const scriptId = id || 'structured-data';
  
  // Remove existing script if present
  const existingScript = document.querySelector(`script#${scriptId}`);
  if (existingScript) {
    existingScript.remove();
  }

  // Create new script
  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Generates sitemap XML for public pages
 */
export const generateSitemap = (events: EventSEOData[]) => {
  const baseUrl = 'https://laurencephotohub.com';
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/events', priority: '0.9', changefreq: 'daily' },
    { url: '/pricing', priority: '0.8', changefreq: 'weekly' }
  ];

  const eventPages = events.map(event => ({
    url: `/recap/${event.id}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: event.date
  }));

  const allPages = [...staticPages, ...eventPages];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    if (page.lastmod) {
      sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
    }
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';
  return sitemap;
};

/**
 * Pre-built SEO configurations for common pages
 */
export const SEO_CONFIGS = {
  home: {
    title: 'Laurence Photo Hub - Premium Event Photography Sharing Platform',
    description: 'Professional event photography sharing with AI-powered features, biometric security, and beautiful public recaps. Perfect for weddings, corporate events, and celebrations.',
    keywords: 'event photography, photo sharing, wedding photos, corporate events, AI photo tagging, professional photography',
    canonicalUrl: 'https://laurencephotohub.com'
  },
  
  publicEvents: {
    title: 'Public Event Recaps - Beautiful Event Photography | Laurence Photo Hub',
    description: 'Discover stunning public event recaps from weddings, corporate events, graduations and more. Get inspired for your own event photography sharing.',
    keywords: 'public events, wedding photos, corporate events, event recaps, photography gallery, celebration photos',
    canonicalUrl: 'https://laurencephotohub.com/events'
  },

  eventRecap: (event: EventSEOData) => ({
    title: `${event.title} - Event Photos | Laurence Photo Hub`,
    description: `${event.description} View stunning photos and highlights from this ${event.location} event by ${event.organizer}.`,
    keywords: `${event.tags.join(', ')}, ${event.location}, ${event.organizer}, event photos`,
    canonicalUrl: event.url,
    ogImage: event.images[0] || '',
    ogType: 'article'
  })
};

/**
 * Track page view for analytics
 */
export const trackPageView = (path: string, title: string) => {
  // In production, integrate with analytics service
  console.log('Page view tracked:', { path, title, timestamp: new Date() });
  
  // Example Google Analytics 4 tracking
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: title,
      page_location: window.location.href
    });
  }
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Allow: /events
Allow: /recap/*

Disallow: /account*
Disallow: /api/*
Disallow: /admin*

Sitemap: https://laurencephotohub.com/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1`;
};

export default {
  updateSEOTags,
  generateEventStructuredData,
  generateImageGalleryStructuredData,
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData,
  insertStructuredData,
  generateSitemap,
  SEO_CONFIGS,
  trackPageView,
  generateRobotsTxt
};