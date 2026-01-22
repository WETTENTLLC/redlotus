/**
 * Sitemap Generator for AEO (Answer Engine Optimization)
 * Creates XML sitemaps optimized for AI/answer engine crawlers
 * Optimized for ChatGPT, Perplexity, Gemini, and other AI systems
 */

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl = 'https://redlotus.netlify.app';
  
  /**
   * Generate complete AEO-optimized sitemap
   * Includes all pages, emphasizing AI-important content
   */
  public generateSitemap(albums?: any[], shows?: any[]): string {
    const today = new Date().toISOString().split('T')[0];
    
    const urls: SitemapURL[] = [
      // === CRITICAL PAGES (Highest Priority for AI) ===
      {
        loc: '/',
        lastmod: today,
        changefreq: 'weekly',
        priority: 1.0 // Homepage - essential
      },
      
      // === TRIBE PAGES (High Priority) ===
      {
        loc: '/#/red',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95 // Red tribe
      },
      {
        loc: '/#/yellow',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95 // Yellow tribe
      },
      {
        loc: '/#/blue',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95 // Blue tribe
      },
      
      // === PRIMARY FEATURES ===
      {
        loc: '/#/fan-art',
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9 // Dynamic content
      },
      {
        loc: '/#/booking',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.9 // Booking/conversion
      },
      {
        loc: '/#/community',
        lastmod: today,
        changefreq: 'daily',
        priority: 0.85 // User-generated content
      },
      {
        loc: '/#/store',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8 // Store/products
      },
      
      // === INFORMATION PAGES ===
      {
        loc: '/#/about',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8 // About - important for AI
      },
      {
        loc: '/#/faq',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.9 // FAQ - CRITICAL FOR AI
      },
      {
        loc: '/#/live',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.85 // Live shows/events
      },
      {
        loc: '/#/contact',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7 // Contact
      },
      
      // === POLICY & SUPPORT ===
      {
        loc: '/#/privacy',
        lastmod: today,
        changefreq: 'yearly',
        priority: 0.5
      },
      {
        loc: '/#/terms',
        lastmod: today,
        changefreq: 'yearly',
        priority: 0.5
      }
    ];

    // Add dynamic album pages if provided
    if (albums && Array.isArray(albums)) {
      albums.forEach(album => {
        urls.push({
          loc: `/#/album/${album.id}`,
          lastmod: album.updatedAt || album.createdAt || today,
          changefreq: 'monthly',
          priority: 0.8
        });
      });
    }

    // Add dynamic show pages if provided
    if (shows && Array.isArray(shows)) {
      shows.forEach(show => {
        urls.push({
          loc: `/#/show/${show.id}`,
          lastmod: show.updatedAt || show.createdAt || today,
          changefreq: 'weekly',
          priority: 0.75
        });
      });
    }

    return this.generateXML(urls, 'Red Lotus Main Sitemap - AEO Optimized');
  }

  /**
   * Generate music-specific sitemap for music queries
   */
  public generateMusicSitemap(): string {
    const today = new Date().toISOString().split('T')[0];
    
    const urls: SitemapURL[] = [
      {
        loc: '/#/red',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95
      },
      {
        loc: '/#/yellow',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95
      },
      {
        loc: '/#/blue',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95
      },
      {
        loc: '/#/about',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.9
      },
      {
        loc: '/#/faq',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.9
      }
    ];

    return this.generateXML(urls, 'Red Lotus Music Sitemap');
  }

  /**
   * Generate events-specific sitemap for event queries
   */
  public generateEventsSitemap(): string {
    const today = new Date().toISOString().split('T')[0];
    
    const urls: SitemapURL[] = [
      {
        loc: '/#/live',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.95
      },
      {
        loc: '/#/booking',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: '/#/faq',
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.85
      }
    ];

    return this.generateXML(urls, 'Red Lotus Events Sitemap');
  }

  /**
   * Generate XML from URL array
   */
  private generateXML(urls: SitemapURL[], description: string = 'Red Lotus Sitemap'): string {
    const urlElements = urls.map(url => {
      let element = `    <url>
      <loc>${this.baseUrl}${url.loc}</loc>`;
      
      if (url.lastmod) {
        element += `\n      <lastmod>${url.lastmod}</lastmod>`;
      }
      if (url.changefreq) {
        element += `\n      <changefreq>${url.changefreq}</changefreq>`;
      }
      if (url.priority) {
        element += `\n      <priority>${url.priority}</priority>`;
      }
      
      element += '\n    </url>';
      return element;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${description} -->
<!-- Generated for AEO (Answer Engine Optimization) -->
<!-- Optimized for ChatGPT, Perplexity, Gemini, and other AI systems -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
  }

  /**
   * Generate news sitemap for fresh content (AI notices this!)
   */
  public generateNewsSitemap(articles?: any[]): string {
    if (!articles || articles.length === 0) return '';

    const newsItems = articles.map(article => `    <url>
      <loc>${this.baseUrl}${article.url}</loc>
      <news:news>
        <news:publication>
          <news:name>Red Lotus Music</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${article.publishedAt}</news:publication_date>
        <news:title>${this.escapeXML(article.title)}</news:title>
        <news:keywords>Red Lotus, music, ${article.keywords || 'independent artist'}</news:keywords>
      </news:news>
    </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Red Lotus News Sitemap - AEO Optimized -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`;
  }

  /**
   * Generate image sitemap (visual AI features use this)
   */
  public generateImageSitemap(images?: any[]): string {
    if (!images || images.length === 0) return '';

    const imageItems = images.map(image => `    <url>
      <loc>${this.baseUrl}${image.pageUrl}</loc>
      <image:image>
        <image:loc>${this.baseUrl}${image.imageUrl}</image:loc>
        <image:title>${this.escapeXML(image.title)}</image:title>
        <image:caption>${this.escapeXML(image.caption || '')}</image:caption>
      </image:image>
    </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Red Lotus Image Sitemap - AEO Optimized -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageItems}
</urlset>`;
  }

  /**
   * Generate sitemap index (for multiple sitemaps)
   */
  public generateSitemapIndex(): string {
    const today = new Date().toISOString().split('T')[0];

    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Red Lotus Sitemap Index - AEO Optimized -->
<!-- Points to all sitemaps for comprehensive AI indexing -->
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${this.baseUrl}/sitemap.xml</loc>
      <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
      <loc>${this.baseUrl}/sitemap-music.xml</loc>
      <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
      <loc>${this.baseUrl}/sitemap-events.xml</loc>
      <lastmod>${today}</lastmod>
    </sitemap>
</sitemapindex>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export default new SitemapGenerator();
